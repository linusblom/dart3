import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { showLoading, State } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  loading$ = this.store.pipe(select(showLoading));

  constructor(private readonly store: Store<State>) {}
}
