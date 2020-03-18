import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { showLoading, State, isAuthenticated } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  loading$ = this.store.pipe(select(showLoading));
  authenticated$ = this.store.pipe(select(isAuthenticated));

  constructor(private readonly store: Store<State>) {}
}
