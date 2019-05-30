import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faBullseye, faCog, faSignOutAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions } from '@core/actions';
import { getMenuOpen, State } from '@root/app.reducer';

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
  menuOpen$: Observable<boolean>;

  gameIcon = faBullseye;
  userIcon = faUsers;
  settingsIcon = faCog;
  logoutIcon = faSignOutAlt;

  constructor(private readonly store: Store<State>, private readonly router: Router) {
    this.menuOpen$ = this.store.pipe(select(getMenuOpen));
  }

  onNavigate(path: string[]) {
    this.router.navigate(path);
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  isRouteActive(path: string) {
    return this.router.isActive(path, false);
  }
}
