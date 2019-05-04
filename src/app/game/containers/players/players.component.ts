import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { createPlayer } from '@game/actions/player.actions';
import { getLoadingCreatePlayer, State } from '@game/reducers';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent {
  loadingCreatePlayer$: Observable<boolean>;

  iconNewPlayer = faUserPlus;
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(private readonly store: Store<State>) {
    this.loadingCreatePlayer$ = this.store.pipe(select(getLoadingCreatePlayer));
  }

  onCreatePlayer() {
    this.store.dispatch(createPlayer({ name: this.name.value }));
    this.name.reset();
  }
}
