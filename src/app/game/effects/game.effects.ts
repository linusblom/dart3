import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { GameActions } from '@game/actions';
import { Game } from '@game/models';
import { State } from '@game/reducers';
import { GameService } from '@game/services';
import { getAccount } from '@root/app.reducer';

@Injectable()
export class GameEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: GameService,
    private readonly store: Store<State>,
  ) {}

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
}
