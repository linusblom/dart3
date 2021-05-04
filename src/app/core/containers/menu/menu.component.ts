import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { getUserPicture, showMenu, State } from '@root/reducers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnDestroy {
  menu$ = this.store.pipe(select(showMenu));
  picture$ = this.store.pipe(
    select(getUserPicture),
    map((picture) => (picture ? picture : '../../../../assets/no_profile.png')),
  );
  authenticated = false;

  private readonly subscription: Subscription;

  constructor(
    private readonly store: Store<State>,
    private readonly router: Router,
    private readonly auth: AuthService,
  ) {
    this.subscription = this.auth.isAuthenticated$.subscribe(
      (authenticated) => (this.authenticated = authenticated),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigate(path: string, login = false) {
    if (login || this.authenticated) {
      this.router.navigate([path]);
    }
  }

  routeActive(path: string, exact = false) {
    return this.router.isActive(path, exact);
  }
}
