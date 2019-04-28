import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

import { createPlayer, loadPlayers, loadPlayersDestroy } from '@game/actions/player.actions';
import { State } from '@root/app.reducer';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnDestroy {
  icon = faUsers;
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(private readonly store: Store<State>) {
    this.store.dispatch(loadPlayers());
  }

  ngOnDestroy() {
    this.store.dispatch(loadPlayersDestroy());
  }

  onCreatePlayer() {
    this.store.dispatch(createPlayer({ name: this.name.value }));

    this.name.reset();
  }
}
