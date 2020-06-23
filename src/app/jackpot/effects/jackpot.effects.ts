import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, catchError } from 'rxjs/operators';

import { JackpotService } from '@jackpot/services';
import { JackpotActions } from '@jackpot/actions';
import { AuthActions } from '@auth/actions';

@Injectable()
export class JackpotEffects {
  getCurrent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JackpotActions.getCurrentJackpotRequest, AuthActions.login),
      concatMap(() =>
        this.service.getCurrent().pipe(
          map(jackpot => JackpotActions.getCurrentJackpotSuccess({ jackpot })),
          catchError(() => [JackpotActions.getCurrentJackpotFailure()]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: JackpotService) {}
}
