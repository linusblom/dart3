import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { PlayerActions } from '@game/actions';
import { State } from '@game/reducers';

@Component({
  selector: 'app-game',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [':host { display: block; height: 100%; width: 100%; }'],
})
export class GameComponent implements OnDestroy {
  constructor(private readonly store: Store<State>) {
    this.store.dispatch(PlayerActions.loadPlayers());
  }

  ngOnDestroy() {
    this.store.dispatch(PlayerActions.loadPlayersDestroy());
  }
}
