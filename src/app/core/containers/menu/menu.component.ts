import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { AuthActions } from '@auth/actions';
import { showMenu, State, getUserPicture } from '@root/reducers';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  menu$ = this.store.pipe(select(showMenu));
  picture$ = this.store.pipe(select(getUserPicture));

  constructor(private readonly store: Store<State>, private readonly router: Router) {}

  navigate(path: string[]) {
    this.router.navigate(path);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  routeActive(path: string, exact = false) {
    return this.router.isActive(path, exact);
  }
}
