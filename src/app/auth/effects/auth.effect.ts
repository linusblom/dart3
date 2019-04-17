import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, switchMap, tap } from 'rxjs/operators';

import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  updateProfile,
  updateProfileFailure,
  updateProfileSuccess,
} from '@auth/actions/auth.actions';
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
        switchMap(({ user }) => [
          loginSuccess({ user }),
          push({
            state: NotificationState.INFO,
            message: `Welcome back ${user.displayName || user.email}!`,
          }),
        ]),
        catchError(error => [
          loginFailure({ error }),
          push({ state: NotificationState.ERROR, message: error.message }),
        ]),
      ),
    ),
  );

  @Effect()
  updateProfile$ = this.actions$.pipe(
    ofType(updateProfile.type),
    concatMap(({ displayName }) =>
      from(this.fireAuth.auth.currentUser.updateProfile({ displayName })).pipe(
        map(() => updateProfileSuccess({ displayName })),
        catchError(error => [
          updateProfileFailure({ error }),
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
