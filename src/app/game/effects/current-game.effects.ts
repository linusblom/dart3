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
import { CurrentGameActions } from '@game/actions';
import { ControllerService } from '@game/controllers';
import { Game, GamePlayer, JackpotDrawType } from '@game/models';
import { getCurrentGame, getCurrentGameLoading, State } from '@game/reducers';
import { GamePlayerService, GameService } from '@game/services';
import { PlayerActions } from '@player/actions';
import { getAccount, hasPermission } from '@root/reducers';

@Injectable()
export class CurrentGameEffects {
  start$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.start),
      exhaustMap(({ gameType, bet, playerIds }) =>
        from(this.gameService.create(gameType, bet, playerIds)).pipe(
          map(() => CurrentGameActions.startSuccess()),
          catchError(() => [CurrentGameActions.startFailure()]),
        ),
      ),
    ),
  );

  valueChangesGameInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.valueChangesGameInit),
      switchMap(({ id }) =>
        this.gameService.valueChanges(id).pipe(
          takeUntil(this.actions$.pipe(ofType(CurrentGameActions.valueChangesGameDestroy))),
          map((game: Game) => CurrentGameActions.valueChangesGameSuccess({ game })),
          catchError(() => [CurrentGameActions.valueChangesGameFailure()]),
        ),
      ),
    ),
  );

  valueChangesGamePlayerInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.valueChangesGamePlayerInit),
      switchMap(({ id }) =>
        this.gamePlayerService.valueChanges(id).pipe(
          takeUntil(this.actions$.pipe(ofType(CurrentGameActions.valueChangesGamePlayerDestroy))),
          map((players: GamePlayer[]) =>
            CurrentGameActions.valueChangesGamePlayerSuccess({ players }),
          ),
          catchError(() => [CurrentGameActions.valueChangesGamePlayerFailure()]),
        ),
      ),
    ),
  );

  updateBoardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CurrentGameActions.valueChangesGameSuccess,
        CurrentGameActions.valueChangesGamePlayerSuccess,
      ),
      withLatestFrom(this.store.pipe(select(getCurrentGameLoading))),
      filter(([_, loading]) => !loading),
      map(() =>
        CurrentGameActions.updateBoardData({
          boardData: this.controllerService.getController().getBoardData(),
        }),
      ),
    ),
  );

  endTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.endTurn),
      withLatestFrom(this.store.pipe(select(getCurrentGame))),
      concatMap(([{ scores }, game]) => {
        const { id, ...data } = this.controllerService.getController().endTurn(scores);

        return from(this.gamePlayerService.update(game.id, id, data)).pipe(
          switchMap(() => [
            CurrentGameActions.endTurnSuccess(),
            PlayerActions.updatePlayerStats({ id: id, scores }),
          ]),
          catchError(() => [CurrentGameActions.endTurnFailure()]),
        );
      }),
    ),
  );

  jackpotGameStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.jackpotGameStart),
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
        return CurrentGameActions.jackpotGameSetRound({ jackpotRound });
      }),
    ),
  );

  nextTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.nextTurn),
      withLatestFrom(this.store.pipe(select(getCurrentGame))),
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
          map(() => CurrentGameActions.nextTurnSuccess()),
          catchError(() => [CurrentGameActions.nextTurnFailure()]),
        );
      }),
    ),
  );

  jackpotGameCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.valueChangesGamePlayerSuccess),
      withLatestFrom(this.store.select(getCurrentGame)),
      map(([{ players }, game]) => {
        const player = players.find(({ id }) => id === game.playerIds[game.currentTurn]);
        return player.currentRound === game.currentRound && player.rounds[player.currentRound];
      }),
      filter(round => !!round),
      distinctUntilKeyChanged('jackpotDraw'),
      filter(({ jackpotDraw }) => jackpotDraw !== JackpotDrawType.PENDING),
      map(({ jackpotDraw, scores }) =>
        scores.filter(({ score }) => score === 0).length
          ? CurrentGameActions.nextTurn()
          : CurrentGameActions.jackpotGameStart({ jackpotDraw, scores }),
      ),
    ),
  );

  abort$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.abort),
      withLatestFrom(this.store.pipe(select(hasPermission(Permission.GAME_DEV_CONTROLS)))),
      filter(([_, hasGameDevControls]) => hasGameDevControls),
      tap(() => this.router.navigate(['start'])),
      map(() => AccountActions.update({ data: { currentGame: null } })),
    ),
  );

  end$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CurrentGameActions.end),
        withLatestFrom(this.store.pipe(select(getAccount))),
        delay(5000),
        tap(([_, { currentGame }]) => this.router.navigate(['results', currentGame])),
      ),
    { dispatch: false },
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
