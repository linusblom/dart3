import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBullseye,
  faChartPie,
  faCog,
  faSignOutAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';

import { AuthActions } from '@core/actions';
import { environment } from '@envs/environment';
import { showMenu, State } from '@root/reducers';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('menuAnimation', [
      state('show', style({ transform: 'translateX(0%)' })),
      state('hide', style({ transform: 'translateX(-100px)' })),
      transition('show <=> hide', animate('300ms ease-in-out')),
    ]),
  ],
})
export class MenuComponent {
  menu$ = this.store.pipe(select(showMenu));

  gameIcon = faBullseye;
  userIcon = faUsers;
  settingsIcon = faCog;
  logoutIcon = faSignOutAlt;
  statsIcon = faChartPie;
  version = environment.version;

  constructor(private readonly store: Store<State>, private readonly router: Router) {}

  onNavigate(path: string[]) {
    this.router.navigate(path);
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  isRouteActive(path: string, exact = false) {
    return this.router.isActive(path, exact);
  }
}
