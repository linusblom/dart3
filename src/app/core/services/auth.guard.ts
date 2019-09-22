import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import { AuthActions } from '@core/actions';
import { getAuthUser, State } from '@root/reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly fireAuth: AngularFireAuth, private readonly store: Store<State>) {}

  canActivate() {
    return this.fireAuth.user.pipe(
      withLatestFrom(this.store.pipe(select(getAuthUser))),
      map(([fireBaseUser, storeUser]) => {
        if (fireBaseUser && storeUser && fireBaseUser.uid === storeUser.uid) {
          return true;
        }

        if (fireBaseUser) {
          this.store.dispatch(AuthActions.loginSuccess({ user: fireBaseUser }));
          return true;
        }

        this.store.dispatch(AuthActions.logout());
        return false;
      }),
    );
  }
}
