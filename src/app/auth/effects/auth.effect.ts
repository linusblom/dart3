import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { login, loginFailure, loginSuccess, logout } from '@auth/actions/auth.actions';
import { push } from '@core/actions/notification.actions';
import { NotificationState } from '@root/core/models';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(login.type),
    exhaustMap(({ email, password }) =>
      from(this.fireAuth.auth.signInWithEmailAndPassword(email, password)).pipe(
        tap(() => this.router.navigate(['/'])),
        map(({ user }) => loginSuccess({ user })),
        catchError(error => [
          loginFailure({ error }),
          push({ state: NotificationState.ERROR, message: error.message }),
        ]),
      ),
    ),
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(logout.type),
    tap(() => {
      this.fireAuth.auth.signOut();
      this.router.navigate(['login']);
    }),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly fireAuth: AngularFireAuth,
  ) {}
}
