import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from './app.reducer';
import { logout } from './auth/actions/auth.actions';

@Component({
  selector: 'app-root',
  template: `
    <app-menu (logout)="onLogout()"></app-menu>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private readonly store: Store<State>) {}

  onLogout() {
    this.store.dispatch(logout());
  }
}
