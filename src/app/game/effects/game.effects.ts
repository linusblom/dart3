import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AccountActions, NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { GameActions } from '@game/actions';
import { HalveIt } from '@game/calculate';
import { Game, GameType, Round } from '@game/models';
import { getGame, State } from '@game/reducers';
import { GameService } from '@game/services';
import { getAccount } from '@root/app.reducer';

@Injectable()
export class GameEffects {
  createGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createGame),
      exhaustMap(({ gameType, bet, players }) =>
        from(this.service.create(gameType, bet, players)).pipe(
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

  changeCurrentTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.endTurnSuccess),
      withLatestFrom(this.store.pipe(select(getGame))),
      switchMap(([{ gameId }, { currentRound, currentTurn, players, scoreboard, type }]) => {
        if (this.shouldEndGame(type, scoreboard.roundScores)) {
          return [GameActions.endGame({ gameId })];
        }

        currentTurn++;

        if (currentTurn === players.length) {
          currentTurn = 0;
          currentRound++;

          return [
            GameActions.createRound({ gameId, round: currentRound, playerCount: players.length }),
            GameActions.updateGame({ data: { currentRound, currentTurn } }),
          ];
        }

        return [GameActions.updateGame({ data: { currentRound, currentTurn } })];
      }),
    ),
  );

  endTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.endTurn),
      concatMap(({ gameId, turn, round, scores }) =>
        from(this.service.updateRound(gameId, turn, round, scores)).pipe(
          map(() => GameActions.endTurnSuccess({ gameId })),
          catchError(error => [GameActions.endTurnFailure(error)]),
        ),
      ),
    ),
  );

  loadRounds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadRound),
      switchMap(({ gameId }) =>
        this.service.listenRounds(gameId).pipe(
          takeUntil(this.actions$.pipe(ofType(GameActions.loadRoundDestroy))),
          map((rounds: Round[]) => GameActions.loadRoundSuccess({ rounds })),
          catchError(error => [GameActions.loadRoundFailure(error)]),
        ),
      ),
    ),
  );

  updateScoreBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadRoundSuccess),
      withLatestFrom(this.store.pipe(select(getGame))),
      map(([{ rounds }, { type }]) => {
        const scoreboard = this.calculateScoreBoard(type, rounds);

        return GameActions.updateScoreBoard({ scoreboard });
      }),
    ),
  );

  createRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createRound),
      concatMap(({ gameId, round, playerCount }) =>
        from(this.service.createRound(gameId, round, playerCount)).pipe(
          map(() => GameActions.createRoundSuccess()),
          catchError(error => [GameActions.createRoundFailure(error)]),
        ),
      ),
    ),
  );

  endGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.endGame),
      concatMap(({ gameId }) =>
        from(this.service.update(gameId, { ended: Date.now() })).pipe(
          switchMap(() => [
            GameActions.endGameSuccess({ gameId }),
            AccountActions.update({ data: { currentGame: null } }),
          ]),
          catchError(error => [GameActions.endTurnFailure(error)]),
        ),
      ),
    ),
  );

  endGameSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GameActions.endGameSuccess),
        delay(3000),
        tap(({ gameId }) => this.router.navigate(['results', gameId])),
      ),
    { dispatch: false },
  );

  private shouldEndGame(type: GameType, roundScores: number[][]) {
    switch (type) {
      case GameType.HALVEIT:
        return roundScores.length === 8 && roundScores[7][roundScores[7].length - 1] !== -1;
    }
  }

  private calculateScoreBoard(type: GameType, rounds: Round[]) {
    switch (type) {
      case GameType.HALVEIT:
        return this.halveIt.calculate(rounds);
    }
  }

  constructor(
    private readonly actions$: Actions,
    private readonly service: GameService,
    private readonly halveIt: HalveIt,
    private readonly store: Store<State>,
    private readonly router: Router,
  ) {}
}
