import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Permission } from 'dart3-sdk';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AccountActions, AuthActions, JackpotActions } from '@core/actions';
import { CoreActions, NotificationActions } from '@core/actions';
import { Status } from '@core/models/notification';
import { PlayerActions } from '@player/actions';
import { getAuthUser, getPermissions, State } from '@root/reducers';

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
      switchMap(() => [
        CoreActions.openMenu(),
        AccountActions.valueChangesInit(),
        PlayerActions.valueChangesInit(),
      ]),
    ),
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      withLatestFrom(this.store.pipe(select(getPermissions))),
      filter(([_, permissions]) => permissions.includes(Permission.CoreAccountWrite)),
      concatMap(([{ displayName }]) =>
        from(this.fireAuth.auth.currentUser.updateProfile({ displayName })).pipe(
          map(() => AuthActions.updateProfileSuccess({ displayName })),
          catchError(error => [
            AuthActions.updateProfileFailure({ error }),
            NotificationActions.push({ status: Status.ERROR, message: error.message }),
          ]),
        ),
      ),
    ),
  );

  reauthenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.reauthenticate),
      withLatestFrom(this.store.pipe(select(getAuthUser))),
      exhaustMap(([{ password, action }, { email }]) => {
        const credentials = firebase.auth.EmailAuthProvider.credential(email, password);
        return from(this.fireAuth.auth.currentUser.reauthenticateWithCredential(credentials)).pipe(
          switchMap(() => [AuthActions.reauthenticateSuccess(), action]),
          catchError(error => [
            AuthActions.reauthenticateFailure({ error }),
            NotificationActions.push({ status: Status.ERROR, message: error.message }),
          ]),
        );
      }),
    ),
  );

  updatePassword = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updatePassword),
      withLatestFrom(this.store.pipe(select(getPermissions))),
      filter(([_, permissions]) => permissions.includes(Permission.CoreAccountWrite)),
      switchMap(([{ newPassword }]) =>
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
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.fireAuth.auth.signOut();
        this.router.navigate(['login']);
      }),
      switchMap(() => [
        CoreActions.closeMenu(),
        AccountActions.valueChangesDestroy(),
        JackpotActions.valueChangesDestroy(),
        PlayerActions.valueChangesDestroy(),
      ]),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly fireAuth: AngularFireAuth,
    private readonly store: Store<State>,
  ) {}
}
