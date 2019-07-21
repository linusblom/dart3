import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { GameActions, PlayerActions } from '@game/actions';
import { config } from '@game/game.config';
import { Game, GamePlayer } from '@game/models';
import { getGame, State } from '@game/reducers';
import { GameService } from '@game/services';
import { getAccount } from '@root/reducers';

@Injectable()
export class GameEffects {
  createGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createGame),
      exhaustMap(({ gameType, bet, playerIds }) =>
        from(this.service.create(gameType, bet, playerIds)).pipe(
          map(() => GameActions.createGameSuccess()),
          catchError(error => [
            GameActions.createGameFailure(error),
            NotificationActions.push({
              status: Status.ERROR,
              message: error.message,
            }),
          ]),
        ),
      ),
    ),
  );

  updateGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.updateGame),
      withLatestFrom(this.store.pipe(select(getAccount))),
      filter(([_, { currentGame }]) => !!currentGame),
      concatMap(([{ data }, { currentGame }]) =>
        from(this.service.update(currentGame, data)).pipe(
          map(() => GameActions.updateGameSuccess()),
          catchError(error => [GameActions.createGameFailure(error)]),
        ),
      ),
    ),
  );

  loadGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGame),
      switchMap(({ gameId }) =>
        this.service.listen(gameId).pipe(
          takeUntil(this.actions$.pipe(ofType(GameActions.loadGameDestroy))),
          map((game: Game) => GameActions.loadGameSuccess({ game })),
          catchError(error => [GameActions.loadGameFailure(error)]),
        ),
      ),
    ),
  );

  endTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.endTurn),
      withLatestFrom(this.store.pipe(select(getGame))),
      concatMap(([{ gameId, scores }, { type, currentRound, currentTurn, playerIds, players }]) => {
        const playerId = playerIds[currentTurn];
        const player = players.find(p => p.id === playerId);
        const controller = config[type].controller;
        const roundScore = controller.calculateRoundScore(scores, currentRound, player.total);

        const data = {
          currentRound,
          rounds: { [currentRound]: roundScore.round },
          total: roundScore.total,
          totalDisplay: roundScore.totalDisplay,
          xp: player.xp + controller.getRoundTotal(scores),
        };

        return from(this.service.updateGamePlayersScores(gameId, playerId, data)).pipe(
          switchMap(() => [
            GameActions.endTurnSuccess(),
            GameActions.nextTurn({ gameId }),
            PlayerActions.updatePlayerStats({ id: playerId, scores }),
          ]),
          catchError(error => [GameActions.endTurnFailure(error)]),
        );
      }),
    ),
  );

  nextRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.nextTurn),
      withLatestFrom(this.store.pipe(select(getGame))),
      concatMap(([{ gameId }, { type, currentRound, currentTurn, players }]) => {
        const controller = config[type].controller;
        const playersCurrentRound = players.map(player => player.currentRound);
        const endGame = controller.shouldEnd(players.length, playersCurrentRound);

        if (!endGame) {
          currentTurn++;

          if (currentTurn === players.length) {
            currentTurn = 0;
            currentRound++;
          }
        }

        return from(
          this.service.update(gameId, {
            ended: endGame ? Date.now() : 0,
            currentRound,
            currentTurn,
          }),
        ).pipe(
          map(() => GameActions.nextTurnSuccess()),
          catchError(error => [GameActions.nextTurnFailure(error)]),
        );
      }),
    ),
  );

  loadGamePlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGamePlayers),
      switchMap(({ gameId }) =>
        this.service.listenGamePlayers(gameId).pipe(
          takeUntil(this.actions$.pipe(ofType(GameActions.loadGamePlayersDestroy))),
          map((players: GamePlayer[]) => GameActions.loadGamePlayersSuccess({ players })),
          catchError(error => [GameActions.loadGamePlayersFailure(error)]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: GameService,
    private readonly store: Store<State>,
  ) {}
}
