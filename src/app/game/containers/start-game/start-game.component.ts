import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Player } from '@game/models';
import { getAllPlayers, getLoadingPlayers, State } from '@game/reducers';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent {
  players$: Observable<Player[]>;
  loadingPlayers$: Observable<boolean>;

  constructor(private readonly store: Store<State>) {
    this.players$ = this.store.pipe(select(getAllPlayers));
    this.loadingPlayers$ = this.store.pipe(select(getLoadingPlayers));
  }
}
