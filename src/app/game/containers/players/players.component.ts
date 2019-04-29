import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { createPlayer, loadPlayers, loadPlayersDestroy } from '@game/actions/player.actions';
import { Player } from '@game/models';
import { getPlayers, State } from '@game/reducers';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnDestroy {
  players$: Observable<Player[]>;
  icon = faUsers;
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(private readonly store: Store<State>) {
    this.store.dispatch(loadPlayers());

    this.store.pipe(select(getPlayers)).subscribe(res => console.log(res));
  }

  ngOnDestroy() {
    this.store.dispatch(loadPlayersDestroy());
  }

  onCreatePlayer() {
    this.store.dispatch(createPlayer({ name: this.name.value }));

    this.name.reset();
  }
}
