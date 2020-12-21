import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { AuthActions } from '@auth/actions';
import { environment } from '@envs/environment';
import { PlayerActions } from '@player/actions';
import { JackpotActions } from '@jackpot/actions';
import { UserActions } from '@user/actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      switchMap(({ url }) =>
        this.service
          .loginWithRedirect({
            redirect_uri: `${environment.siteUrl}/auth`,
            appState: { target: url },
          })
          .pipe(
            map(() => AuthActions.loginSuccess()),
            catchError(() => [AuthActions.loginFailure()]),
          ),
      ),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout, AuthActions.loginFailure),
        tap(() => this.service.logout()),
      ),
    { dispatch: false },
  );

  firstLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setAuthenticated),
      filter(({ authenticated }) => authenticated),
      take(1),
      switchMap(() => [
        PlayerActions.getRequest(),
        JackpotActions.getCurrentRequest(),
        UserActions.getRequest(),
      ]),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: AuthService) {}
}
