import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, catchError, filter, delay } from 'rxjs/operators';

import { JackpotService } from '@jackpot/services';
import { JackpotActions } from '@jackpot/actions';
import { AuthActions } from '@auth/actions';

@Injectable()
export class JackpotEffects {
  getCurrent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JackpotActions.getCurrentRequest, AuthActions.login),
      concatMap(() =>
        this.service.getCurrent().pipe(
          map((jackpot) => JackpotActions.getCurrentSuccess({ jackpot })),
          catchError(() => [JackpotActions.getCurrentFailure()]),
        ),
      ),
    ),
  );

  reset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JackpotActions.start),
      filter(({ jackpot }) => !!jackpot.playerIds && jackpot.playerIds.length > 0),
      delay(2000),
      map(() => JackpotActions.reset()),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: JackpotService) {}
}
