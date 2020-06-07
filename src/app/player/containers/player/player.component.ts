import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Player, TransactionType } from 'dart3-sdk';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { State, getSelectedPlayer, getAllPlayers, getSelectedPlayerUid } from '@root/reducers';
import { PlayerActions } from '@player/actions';
import { CoreActions } from '@core/actions';
import { CurrencyPipe } from '@shared/pipes/currency.pipe';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnDestroy {
  uid: string;
  player = {} as Player;
  players: Player[] = [];

  TransactionType = TransactionType;

  settingsForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pro: new FormControl(false),
  });

  transactionForm = new FormGroup(
    {
      type: new FormControl(TransactionType.Deposit, Validators.required),
      amount: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(99999)]),
      receiverUid: new FormControl(),
    },
    controls => {
      const { type, receiverUid } = controls.value;
      return type === TransactionType.Transfer && !receiverUid ? { playerIdError: true } : null;
    },
  );

  private readonly destroy$ = new Subject();

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute,
    private readonly currency: CurrencyPipe,
  ) {
    this.uid = this.route.snapshot.params.uid;

    this.store.dispatch(PlayerActions.getByUidRequest({ uid: this.uid }));

    this.store.pipe(select(getSelectedPlayer), takeUntil(this.destroy$)).subscribe(player => {
      this.settingsForm.patchValue(
        {
          name: player.name,
          pro: player.pro,
        },
        { emitEvent: false },
      );
      this.player = player;
    });

    combineLatest([
      this.store.pipe(select(getAllPlayers)),
      this.store.pipe(select(getSelectedPlayerUid)),
    ])
      .pipe(
        takeUntil(this.destroy$),
        map(([players, selectedUid]) => players.filter(({ uid }) => uid !== selectedUid)),
      )
      .subscribe(players => (this.players = players));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  update() {
    if (this.settingsForm.valid) {
      const { name, pro } = this.settingsForm.value;
      this.store.dispatch(PlayerActions.updateRequest({ uid: this.uid, player: { name, pro } }));
    }
  }

  resetPin() {
    this.store.dispatch(
      CoreActions.showModal({
        modal: {
          header: 'Reset PIN',
          text: `Are you sure you want to reset your PIN code? New PIN code will be sent to <strong>${this.player.email}</strong>.`,
          backdrop: {
            dismiss: true,
          },
          cancel: { dismiss: true },
          ok: {
            text: 'Send PIN',
            color: 'error',
            dismiss: true,
            action: () => PlayerActions.resetPinRequest({ uid: this.uid }),
          },
        },
      }),
    );
  }

  delete() {
    this.store.dispatch(
      CoreActions.confirmPin({
        header: 'Delete player',
        text: `Are you sure you want to delete player <strong>${this.player.name}</strong>?`,
        action: PlayerActions.deleteRequest({ uid: this.uid }),
        okText: 'Delete',
        okColor: 'error',
      }),
    );
  }

  setTransactionType(type: TransactionType) {
    this.transactionForm.reset();
    this.transactionForm.get('type').setValue(type);
  }

  executeTransaction() {
    const { type, amount, receiverUid } = this.transactionForm.value;
    const currencyAmount = this.currency.transform(amount);
    const receiverPlayerName = receiverUid
      ? ` to <strong>${this.players.find(({ uid }) => uid === receiverUid).name}</strong>`
      : '';

    this.store.dispatch(
      CoreActions.confirmPin({
        header: 'Transaction',
        text: `Are you sure you want to ${type} <strong>${currencyAmount}</strong>${receiverPlayerName}?`,
        action: PlayerActions.transactionRequest({
          uid: this.uid,
          _type: type,
          transaction: { amount },
          receiverUid,
        }),
      }),
    );
  }
}
