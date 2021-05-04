import { Component, HostBinding } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { delay, tap } from 'rxjs/operators';

import { showBanner, showFooter, showLoading, showMenu, showModal, State } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
  loading$ = this.store.pipe(select(showLoading));

  @HostBinding('class.padding') padding = false;

  constructor(private readonly store: Store<State>) {}
}
