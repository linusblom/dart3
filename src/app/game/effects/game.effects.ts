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
import { GameActions } from '@game/actions';
import { Game, GamePlayer } from '@game/models';
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
      map(([_, { currentRound, currentTurn, playerOrder }]) => {
        currentTurn++;

        if (currentTurn === playerOrder.length) {
          currentTurn = 0;
          currentRound++;
        }

        return GameActions.updateGame({ data: { currentRound, currentTurn } });
      }),
    ),
  );

  endTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.endTurn),
      withLatestFrom(this.store.pipe(select(getGame))),
      concatMap(([{ gameId, scores }, { currentRound, currentTurn, playerOrder }]) =>
        from(
          this.service.updateGamePlayersScores(
            gameId,
            currentRound,
            playerOrder[currentTurn],
            scores,
          ),
        ).pipe(
          map(() => GameActions.endTurnSuccess()),
          catchError(error => [GameActions.endTurnFailure(error)]),
        ),
      ),
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
