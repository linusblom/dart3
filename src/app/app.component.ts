import { Component, HostBinding } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthService } from '@auth0/auth0-angular';
import { trigger, style, transition, animate } from '@angular/animations';
import { tap, delay, map, shareReplay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { showLoading, State, showModal, showMenu, showFooter, showBanner } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('menuLeave', [
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(-100px)' })),
      ]),
    ]),
  ],
})
export class AppComponent {
  showMenu$ = this.store.pipe(
    select(showMenu),
    delay(0),
    tap((padding) => (this.padding = padding)),
  );
  showModal$ = this.store.pipe(select(showModal));
  showFooter$ = this.store.pipe(select(showFooter), delay(0));
  showBanner$ = this.store.pipe(select(showBanner));
  authenticated$ = this.auth.isAuthenticated$.pipe(shareReplay(1));
  loading$ = combineLatest([this.store.pipe(select(showLoading)), this.authenticated$]).pipe(
    map(([loading, authenticated]) => !authenticated || loading),
  );

  @HostBinding('class.padding') padding = false;

  constructor(private readonly store: Store<State>, private auth: AuthService) {}
}
