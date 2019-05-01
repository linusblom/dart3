import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { from } from 'rxjs';
import { catchError, concatMap, exhaustMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  updatePassword,
  updatePasswordFailure,
  updatePasswordSuccess,
  updateProfile,
  updateProfileFailure,
  updateProfileSuccess,
} from '@auth/actions/auth.actions';
import { push } from '@core/actions/notification.actions';
import { NotificationState } from '@core/models';
import { getAuthUser, State } from '@root/app.reducer';

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
        switchMap(() => [
          updateProfileSuccess({ displayName }),
          push({ state: NotificationState.SUCCESS, message: 'Account name updated' }),
        ]),
        catchError(error => [
          updateProfileFailure({ error }),
          push({ state: NotificationState.ERROR, message: error.message }),
        ]),
      ),
    ),
  );

  @Effect()
  updatePassword$ = this.actions$.pipe(
    ofType(updatePassword.type),
    withLatestFrom(this.store.pipe(select(getAuthUser))),
    exhaustMap(([{ newPassword, currentPassword }, { email }]) => {
      const credentials = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
      return from(
        this.fireAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials),
      ).pipe(
        concatMap(() =>
          from(this.fireAuth.auth.currentUser.updatePassword(newPassword)).pipe(
            switchMap(() => [
              updatePasswordSuccess(),
              push({ state: NotificationState.SUCCESS, message: 'Account password changed' }),
            ]),
            catchError(error => [
              updatePasswordFailure({ error }),
              push({ state: NotificationState.ERROR, message: error.message }),
            ]),
          ),
        ),
        catchError(error => [
          updatePasswordFailure({ error }),
          push({ state: NotificationState.ERROR, message: error.message }),
        ]),
      );
    }),
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
    private readonly store: Store<State>,
  ) {}
}
