import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { GameActions } from '@game/actions';
import { GameService } from '@game/services';

@Injectable()
export class GameEffects {
  constructor(private readonly actions$: Actions, private readonly service: GameService) {}

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
}
