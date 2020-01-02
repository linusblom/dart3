import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Player, Transaction } from 'dart3-sdk';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/operators';

import { PlayerActions, TransactionActions } from '@player/actions';
import { TransactionPayload } from '@player/models';
import {
  getAllPlayers,
  getLoadingCreatePlayer,
  getLoadingPlayers,
  getSelectedPlayer,
  getSelectedPlayerId,
  State,
} from '@root/reducers';
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

  constructor(
    private readonly store: Store<State>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.loadingCreatePlayer$ = this.store.pipe(select(getLoadingCreatePlayer));
    this.loadingPlayers$ = this.store.pipe(select(getLoadingPlayers));
    this.playersListItem$ = this.store.pipe(
      select(getAllPlayers),
      map(players =>
        players
          .map(player => ({ id: player.id, disabled: !player.created, value: player.name }))
          .sort((a, b) => (a.value.toLowerCase() < b.value.toLowerCase() ? -1 : 1)),
      ),
    );

    this.store
      .pipe(select(getSelectedPlayerId))
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap(() => this.store.dispatch(TransactionActions.valueChangesDestroy())),
        filter(id => !!id),
      )
      .subscribe(id => {
        this.store.dispatch(TransactionActions.valueChangesInit({ id }));
      });

    this.store
      .pipe(select(getSelectedPlayer), takeUntil(this.destroy$))
      .subscribe(selectedPlayer => (this.selectedPlayer = selectedPlayer));

    this.route.params.pipe(takeUntil(this.destroy$), pluck('id')).subscribe(id => {
      this.selectedPlayerId = id;
      this.store.dispatch(PlayerActions.select({ id }));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(TransactionActions.valueChangesDestroy());
  }

  onCreate() {
    this.store.dispatch(PlayerActions.create({ name: this.name.value }));
    this.name.reset();
  }

  onSelectPlayer(id: string) {
    this.router.navigate(['players', id]);
  }

  onUpdate(data: Partial<Player>) {
    this.store.dispatch(PlayerActions.update({ id: this.selectedPlayerId, data }));
  }

  onUpdateAvatar(file: File) {
    this.store.dispatch(PlayerActions.updateAvatar({ id: this.selectedPlayerId, file }));
  }

  onTransaction(transaction: TransactionPayload) {
    this.store.dispatch(TransactionActions.create({ id: this.selectedPlayerId, transaction }));
  }
}
