import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { loginSuccess, logout } from '@auth/actions/auth.actions';
import { State } from '@root/app.reducer';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly fireAuth: AngularFireAuth, private readonly store: Store<State>) {}

  canActivate() {
    return this.fireAuth.user.pipe(
      map(user => {
        if (user) {
          this.store.dispatch(loginSuccess({ user }));
          return true;
        }

        this.store.dispatch(logout());
        return false;
      }),
    );
  }
}
