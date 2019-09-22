import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilKeyChanged,
  exhaustMap,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AccountActions } from '@core/actions';
import { Permission } from '@core/models';
import { GameActions } from '@game/actions';
import { ControllerService } from '@game/controllers';
import { Game, GamePlayer, JackpotDrawType } from '@game/models';
import { getGame, getLoadingGame, State } from '@game/reducers';
import { GameService } from '@game/services';
import { PlayerActions } from '@player/actions';
import { getAccount, hasPermission } from '@root/reducers';

@Injectable()
export class GameEffects {
  createGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createGame),
      exhaustMap(({ gameType, bet, playerIds }) =>
        from(this.service.create(gameType, bet, playerIds)).pipe(
          map(() => GameActions.createGameSuccess()),
          catchError(() => [GameActions.createGameFailure()]),
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
          catchError(() => [GameActions.createGameFailure()]),
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
          catchError(() => [GameActions.loadGameFailure()]),
        ),
      ),
    ),
  );

  updateGameData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGameSuccess, GameActions.loadGamePlayersSuccess),
      withLatestFrom(this.store.pipe(select(getLoadingGame))),
      filter(([_, loading]) => !loading),
      map(() =>
        GameActions.updateGameData({ data: this.controllerService.getController().getGameData() }),
      ),
    ),
  );

  endTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.endTurn),
      withLatestFrom(this.store.pipe(select(getGame))),
      concatMap(([{ scores }, game]) => {
        const { id, ...data } = this.controllerService.getController().endTurn(scores);

        return from(this.service.updateGamePlayersScores(game.id, id, data)).pipe(
          switchMap(() => [
            GameActions.endTurnSuccess(),
            PlayerActions.updatePlayerStats({ id: id, scores }),
          ]),
          catchError(() => [GameActions.endTurnFailure()]),
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
      concatMap(([_, { id, currentRound, currentTurn, players, playerIds }]) => {
        const getNextTurn = (turn: number, round: number) => {
          if (++turn === players.length) {
            turn = 0;
            round++;
          }

          return players.find(player => player.id === playerIds[turn]).position === 0
            ? { currentTurn: turn, currentRound: round }
            : getNextTurn(turn, round);
        };

        const endGame = this.controllerService.getController().shouldGameEnd();

        return from(
          this.service.update(id, {
            ended: endGame ? Date.now() : 0,
            ...(!endGame && getNextTurn(currentTurn, currentRound)),
          }),
        ).pipe(
          map(() => GameActions.nextTurnSuccess()),
          catchError(() => [GameActions.nextTurnFailure()]),
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
          catchError(() => [GameActions.loadGamePlayersFailure()]),
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

  abortGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.abortGame),
      withLatestFrom(this.store.pipe(select(hasPermission(Permission.GAME_DEV_CONTROLS)))),
      filter(([_, hasGameDevControls]) => hasGameDevControls),
      tap(() => this.router.navigate(['start'])),
      map(() => AccountActions.update({ data: { currentGame: null } })),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: GameService,
    private readonly store: Store<State>,
    private readonly controllerService: ControllerService,
    private readonly router: Router,
  ) {}
}
