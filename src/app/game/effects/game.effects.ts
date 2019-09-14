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
  distinctUntilKeyChanged,
} from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { GameActions, PlayerActions } from '@game/actions';
import { config } from '@game/game.config';
import { Game, GamePlayer, JackpotDrawType } from '@game/models';
import { getGame, State } from '@game/reducers';
import { GameService } from '@game/services';
import { getAccount } from '@root/reducers';
import { environment } from '@envs/environment';

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
      concatMap(([{ scores }, game]) => {
        const { id, ...data } = config[game.type].controller.endTurn(scores, game);

        return from(this.service.updateGamePlayersScores(game.id, id, data)).pipe(
          switchMap(() => [
            GameActions.endTurnSuccess(),
            PlayerActions.updatePlayerStats({ id: id, scores }),
          ]),
          catchError(error => [GameActions.endTurnFailure(error)]),
        );
      }),
    ),
  );

  jackpotGameStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.jackpotGameStart),
      map(({ jackpotDraw, scores }) => {
        const getAllScores = (multiplier: number) =>
          Array(20)
            .fill(null)
            .map((_, index) => ({ score: index + 1, multiplier }));

        const availableScores = [
          ...getAllScores(1),
          ...getAllScores(1),
          ...getAllScores(1),
          ...getAllScores(2),
          ...getAllScores(3),
          { score: 25, multiplier: 1 },
          { score: 25, multiplier: 2 },
        ].filter(
          as =>
            !scores.some(
              ({ score, multiplier }) => score === as.score && multiplier === as.multiplier,
            ),
        );

        const randomizeHitCount = () => {
          const number = Math.random();
          switch (true) {
            case number < 0.7:
              return 0;
            case number < 0.95:
              return 1;
            case number < 1:
              return 2;
          }
        };

        const randomizeScores = () => {
          const hitCount = randomizeHitCount();
          return scores.map((score, index) =>
            index < hitCount
              ? score
              : availableScores[Math.floor(Math.random() * availableScores.length)],
          );
        };

        const jackpotRound = {
          win: jackpotDraw === JackpotDrawType.WIN,
          hits: jackpotDraw === JackpotDrawType.WIN ? scores : randomizeScores(),
        };
        return GameActions.jackpotGameSetRound({ jackpotRound });
      }),
    ),
  );

  nextTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.nextTurn),
      withLatestFrom(this.store.pipe(select(getGame))),
      concatMap(([_, { id, type, currentRound, currentTurn, players, playerIds }]) => {
        const getNextTurn = (turn: number, round: number) => {
          if (++turn === players.length) {
            turn = 0;
            round++;
          }

          return players.find(player => player.id === playerIds[turn]).position === 0
            ? { currentTurn: turn, currentRound: round }
            : getNextTurn(turn, round);
        };

        const endGame = config[type].controller.shouldGameEnd(players);

        return from(
          this.service.update(id, {
            ended: endGame ? Date.now() : 0,
            ...(!endGame && getNextTurn(currentTurn, currentRound)),
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

  loadGamePlayersSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGamePlayersSuccess),
      withLatestFrom(this.store.select(getGame)),
      map(([{ players }, game]) => {
        const player = players.find(({ id }) => id === game.playerIds[game.currentTurn]);
        return player.currentRound === game.currentRound && player.rounds[player.currentRound];
      }),
      filter(round => !!round),
      distinctUntilKeyChanged('jackpotDraw'),
      filter(({ jackpotDraw }) => jackpotDraw !== JackpotDrawType.PENDING),
      map(({ jackpotDraw, scores }) =>
        scores.filter(({ score }) => score === 0).length
          ? GameActions.nextTurn()
          : GameActions.jackpotGameStart({ jackpotDraw, scores }),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: GameService,
    private readonly store: Store<State>,
  ) {}
}
