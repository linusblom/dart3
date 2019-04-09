import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';

import { logout } from '@auth/actions/auth.actions';
import { State } from '@root/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<State>) {}

  canActivate() {
    this.store.dispatch(logout());
    return false;
  }
}
