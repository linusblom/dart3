import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
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
import { GameActions, GamePlayerActions } from '@game/actions';
import { ControllerService } from '@game/controllers';
import { Game, JackpotDrawType } from '@game/models';
import { getGame, getLoadingGame, State } from '@game/reducers';
import { GamePlayerService, GameService } from '@game/services';
import { PlayerActions } from '@player/actions';
import { getAccount, hasPermission } from '@root/reducers';

@Injectable()
export class GameEffects {
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.create),
      exhaustMap(({ gameType, bet, playerIds }) =>
        from(this.gameService.create(gameType, bet, playerIds)).pipe(
          map(() => GameActions.createSuccess()),
          catchError(() => [GameActions.createFailure()]),
        ),
      ),
    ),
  );

  valueChangesInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.valueChangesInit),
      switchMap(({ id }) =>
        this.gameService.valueChanges(id).pipe(
          takeUntil(this.actions$.pipe(ofType(GameActions.valueChangesDestroy))),
          map((game: Game) => GameActions.valueChangesSuccess({ game })),
          catchError(() => [GameActions.valueChangesFailure()]),
        ),
      ),
    ),
  );

  updateGameData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.valueChangesSuccess, GamePlayerActions.valueChangesSuccess),
      withLatestFrom(this.store.pipe(select(getLoadingGame))),
      filter(([_, loading]) => !loading),
      map(() =>
        GameActions.updateBoardData({ boardData: this.controllerService.getController().getBoardData() }),
      ),
    ),
  );

  endTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.endTurn),
      withLatestFrom(this.store.pipe(select(getGame))),
      concatMap(([{ scores }, game]) => {
        const { id, ...data } = this.controllerService.getController().endTurn(scores);

        return from(this.gamePlayerService.update(game.id, id, data)).pipe(
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
          this.gameService.update(id, {
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

  jackpotGameCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePlayerActions.valueChangesSuccess),
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

  abort$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.abort),
      withLatestFrom(this.store.pipe(select(hasPermission(Permission.GAME_DEV_CONTROLS)))),
      filter(([_, hasGameDevControls]) => hasGameDevControls),
      tap(() => this.router.navigate(['start'])),
      map(() => AccountActions.update({ data: { currentGame: null } })),
    ),
  );

  end$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.end),
      withLatestFrom(this.store.pipe(select(getAccount))),
      delay(5000),
      tap(([_, { currentGame }]) => this.router.navigate(['results', currentGame])),
    ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly gameService: GameService,
    private readonly gamePlayerService: GamePlayerService,
    private readonly store: Store<State>,
    private readonly controllerService: ControllerService,
    private readonly router: Router,
  ) {}
}
