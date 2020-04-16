import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import { AuthActions } from '@auth/actions';
import { AuthService } from '@auth/services';
import { CoreActions } from '@core/actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      map(() => CoreActions.toggleMenu()),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.service.logout()),
      map(() => CoreActions.toggleMenu()),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: AuthService) {}
}
