import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AuthActions } from '@core/actions';
import { CoreActions, NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { getAuthUser, State } from '@root/app.reducer';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        from(this.fireAuth.auth.signInWithEmailAndPassword(email, password)).pipe(
          tap(() => this.router.navigate(['/'])),
          switchMap(({ user }) => [
            AuthActions.loginSuccess({ user }),
            NotificationActions.push({
              status: Status.INFO,
              message: `Welcome back ${user.displayName || user.email}!`,
            }),
          ]),
          catchError(error => [
            AuthActions.loginFailure({ error }),
            NotificationActions.push({ status: Status.ERROR, message: error.message }),
          ]),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => CoreActions.openMenu()),
    ),
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      concatMap(({ displayName }) =>
        from(this.fireAuth.auth.currentUser.updateProfile({ displayName })).pipe(
          switchMap(() => [
            AuthActions.updateProfileSuccess({ displayName }),
            NotificationActions.push({
              status: Status.SUCCESS,
              message: 'Account name updated',
            }),
          ]),
          catchError(error => [
            AuthActions.updateProfileFailure({ error }),
            NotificationActions.push({ status: Status.ERROR, message: error.message }),
          ]),
        ),
      ),
    ),
  );

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updatePassword),
      withLatestFrom(this.store.pipe(select(getAuthUser))),
      exhaustMap(([{ newPassword, currentPassword }, { email }]) => {
        const credentials = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
        return from(
          this.fireAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials),
        ).pipe(
          concatMap(() =>
            from(this.fireAuth.auth.currentUser.updatePassword(newPassword)).pipe(
              switchMap(() => [
                AuthActions.updatePasswordSuccess(),
                NotificationActions.push({
                  status: Status.SUCCESS,
                  message: 'Account password changed',
                }),
              ]),
              catchError(error => [
                AuthActions.updatePasswordFailure({ error }),
                NotificationActions.push({
                  status: Status.ERROR,
                  message: error.message,
                }),
              ]),
            ),
          ),
          catchError(error => [
            AuthActions.updatePasswordFailure({ error }),
            NotificationActions.push({ status: Status.ERROR, message: error.message }),
          ]),
        );
      }),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.fireAuth.auth.signOut();
        this.router.navigate(['login']);
      }),
      map(() => CoreActions.closeMenu()),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly fireAuth: AngularFireAuth,
    private readonly store: Store<State>,
  ) {}
}
