import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getLoading, State } from '@game/reducers';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  loading$: Observable<boolean>;

  constructor(private readonly store: Store<State>) {
    this.loading$ = this.store.select(getLoading);
  }
}
