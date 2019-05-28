import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';

import { PlayerActions, TransactionActions } from '@game/actions';
import { createPlayer } from '@game/actions/player.actions';
import { Player, Transaction, TransactionPayload } from '@game/models';
import {
  getAllPlayers,
  getAllTransactions,
  getLoadingCreatePlayer,
  getLoadingPlayers,
  getSelectedPlayer,
  getSelectedPlayerId,
  State,
} from '@game/reducers';
import { BoxListItem, BoxTab } from '@shared/modules/box/box.models';

enum Tabs {
  INFO = 'info',
  BANK = 'bank',
  STATS = 'stats',
}

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnDestroy {
  loadingCreatePlayer$: Observable<boolean>;
  loadingPlayers$: Observable<boolean>;
  playersListItem$: Observable<BoxListItem[]>;
  selectedPlayerId$: Observable<string>;
  transactions$: Observable<Transaction[]>;

  Tabs = Tabs;
  selectedPlayer = {} as Player;
  selectedPlayerId: string;
  iconPlayers = faUsers;
  iconNewPlayer = faUserPlus;
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  activeTab = Tabs.INFO;
  tabs: BoxTab[] = [
    { name: 'Info', value: Tabs.INFO },
    { name: 'Bank', value: Tabs.BANK },
    { name: 'Statistics', value: Tabs.STATS },
  ];

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    this.loadingCreatePlayer$ = this.store.pipe(select(getLoadingCreatePlayer));
    this.loadingPlayers$ = this.store.pipe(select(getLoadingPlayers));
    this.selectedPlayerId$ = this.store.pipe(select(getSelectedPlayerId));
    this.transactions$ = this.store.pipe(select(getAllTransactions));
    this.playersListItem$ = this.store.pipe(
      select(getAllPlayers),
      map(players =>
        players.map(player => ({ id: player.id, disabled: !player.created, value: player.name })),
      ),
    );

    this.selectedPlayerId$
      .pipe(
        takeUntil(this.destroy$),
        filter(playerId => !!playerId),
        distinctUntilChanged(),
        tap(() => this.store.dispatch(TransactionActions.loadTransactionsDestroy())),
      )
      .subscribe(playerId => {
        this.store.dispatch(TransactionActions.loadTransactions({ playerId }));
        this.selectedPlayerId = playerId;
      });

    this.store
      .pipe(
        select(getSelectedPlayer),
        takeUntil(this.destroy$),
      )
      .subscribe(selectedPlayer => (this.selectedPlayer = selectedPlayer));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(TransactionActions.loadTransactionsDestroy());
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

  onUpdateAvatar(file: File) {
    this.store.dispatch(PlayerActions.updateAvatar({ id: this.selectedPlayerId, file }));
  }

  onTransaction(transaction: TransactionPayload) {
    this.store.dispatch(
      TransactionActions.transaction({ playerId: this.selectedPlayerId, transaction }),
    );
  }
}
