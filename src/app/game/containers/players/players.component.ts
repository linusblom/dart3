import { Component, OnDestroy } from '@angular/core';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

import { loadPlayers, loadPlayersDestroy } from '@game/actions/player.actions';
import { State } from '@root/app.reducer';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnDestroy {
  icon = faUsers;

  constructor(private readonly store: Store<State>) {
    this.store.dispatch(loadPlayers());
  }

  ngOnDestroy() {
    this.store.dispatch(loadPlayersDestroy());
  }
}
