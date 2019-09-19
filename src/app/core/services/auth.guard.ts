import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AuthActions } from '@core/actions';
import { State } from '@root/reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly fireAuth: AngularFireAuth, private readonly store: Store<State>) {}

  canActivate() {
    return this.fireAuth.user.pipe(
      map(user => {
        if (user) {
          this.store.dispatch(AuthActions.loginSuccess({ user }));
          return true;
        }

        this.store.dispatch(AuthActions.logout());
        return false;
      }),
    );
  }
}
