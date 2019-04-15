import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

import { State } from '@root/app.reducer';
import { logout } from '@root/auth/actions/auth.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor(private readonly store: Store<State>) {}
  menuIcon = faBars;

  logoutClick() {
    this.store.dispatch(logout());
  }
}
