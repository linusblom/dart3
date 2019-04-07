import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';

import { State } from '@root/app.reducer';
import { Logout } from '@auth/actions/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<State>) {}

  canActivate() {
    this.store.dispatch(new Logout(undefined));
    return false;
  }
}
