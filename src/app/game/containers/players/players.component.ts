import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { PlayerActions } from '@game/actions';
import { createPlayer } from '@game/actions/player.actions';
import { Player } from '@game/models';
import {
  getAllPlayers,
  getLoadingCreatePlayer,
  getLoadingPlayers,
  getSelectedPlayer,
  getSelectedPlayerId,
  State,
} from '@game/reducers';
import { BoxListItem } from '@shared/modules/box/box.models';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnDestroy {
  loadingCreatePlayer$: Observable<boolean>;
  loadingPlayers$: Observable<boolean>;
  playersListItem$: Observable<BoxListItem[]>;
  selectedPlayer$: Observable<Player>;

  selectedPlayerId: string;
  iconPlayers = faUsers;
  iconNewPlayer = faUserPlus;
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    this.loadingCreatePlayer$ = this.store.pipe(select(getLoadingCreatePlayer));
    this.loadingPlayers$ = this.store.pipe(select(getLoadingPlayers));
    this.selectedPlayer$ = this.store.pipe(select(getSelectedPlayer));
    this.playersListItem$ = this.store.pipe(
      select(getAllPlayers),
      map(players =>
        players.map(player => ({ id: player.id, disabled: !player.created, value: player.name })),
      ),
    );

    this.store
      .pipe(
        select(getSelectedPlayerId),
        takeUntil(this.destroy$),
      )
      .subscribe(selectedPlayerId => (this.selectedPlayerId = selectedPlayerId));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onCreate() {
    this.store.dispatch(createPlayer({ name: this.name.value }));
    this.name.reset();
  }

  onSelect(id: string) {
    this.store.dispatch(PlayerActions.selectPlayer({ id }));
  }

  onUpdate(data: Partial<Player>) {
    this.store.dispatch(PlayerActions.updatePlayer({ id: this.selectedPlayerId, data }));
  }
}
