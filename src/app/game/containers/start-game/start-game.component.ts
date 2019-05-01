import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { createPlayer } from '@game/actions/player.actions';
import { Player } from '@game/models';
import { getLoadingCreatePlayer, getLoadingPlayers, getPlayers, State } from '@game/reducers';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent {
  players$: Observable<Player[]>;
  loadingPlayers$: Observable<boolean>;
  loadingCreatePlayer$: Observable<boolean>;

  constructor(private readonly store: Store<State>) {
    this.players$ = this.store.pipe(select(getPlayers));
    this.loadingPlayers$ = this.store.pipe(select(getLoadingPlayers));
    this.loadingCreatePlayer$ = this.store.pipe(select(getLoadingCreatePlayer));
  }

  onCreatePlayer(name: string) {
    this.store.dispatch(createPlayer({ name }));
  }
}
