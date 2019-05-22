import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { loadPlayers, loadPlayersDestroy } from '@game/actions/player.actions';
import { State } from '@game/reducers';

@Component({
  selector: 'app-game',
  template: '<router-outlet></router-outlet>',
  styles: [':host { display: block; height: 100%; width: 100%; }'],
})
export class GameComponent implements OnDestroy {
  constructor(private readonly store: Store<State>) {
    this.store.dispatch(loadPlayers());
  }

  ngOnDestroy() {
    this.store.dispatch(loadPlayersDestroy());
  }
}
