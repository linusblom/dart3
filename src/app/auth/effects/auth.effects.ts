import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, switchMap } from 'rxjs/operators';

import { AuthActions } from '@auth/actions';
import { AuthService } from '@auth/services';
import { CoreActions } from '@core/actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(() => [
        CoreActions.toggleMenu({ menu: true }),
        CoreActions.toggleFooter({ footer: true }),
      ]),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.service.logout()),
      switchMap(() => [
        CoreActions.toggleMenu({ menu: false }),
        CoreActions.toggleFooter({ footer: false }),
      ]),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: AuthService) {}
}
