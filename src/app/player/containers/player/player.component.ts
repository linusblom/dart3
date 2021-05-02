import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { GRAVATAR, Player, Role, TransactionType } from 'dart3-sdk';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { CoreActions } from '@core/actions';
import { PlayerActions } from '@player/actions';
import {
  getAllPlayers,
  getPlayerStoreState,
  getSelectedPlayer,
  getSelectedPlayerUid,
  getUserCurrency,
  State,
} from '@root/reducers';
import { StoreState, TooltipPosition } from '@shared/models';
import { UserActions } from '@user/actions';
import { hasRole } from '@utils/player-roles';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnDestroy {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  loading$ = this.store.pipe(
    select(getPlayerStoreState),
    map((state) => state === StoreState.FETCHING),
  );
  uid: string;
  player = {} as Player;
  players: Player[] = [];
  currency = '';
  Role = Role;

  TransactionType = TransactionType;
  TooltipPosition = TooltipPosition;
  GRAVATAR = GRAVATAR;

  settingsForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pro: new FormControl(false),
    single: new FormControl(20, [Validators.required, Validators.min(1), Validators.max(25)]),
    double: new FormControl(20, [Validators.required, Validators.min(1), Validators.max(25)]),
    triple: new FormControl(20, [Validators.required, Validators.min(1), Validators.max(25)]),
  });

  transactionForm = new FormGroup(
    {
      type: new FormControl(TransactionType.Deposit, Validators.required),
      amount: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(99999)]),
      receiverUid: new FormControl(),
    },
    (controls) => {
      const { type, receiverUid } = controls.value;
      return type === TransactionType.Transfer && !receiverUid ? { playerIdError: true } : null;
    },
  );

  avatar = new FormControl('', [
    Validators.required,
    Validators.pattern(/^https?:\/\/[^\s/$.?#].[^\s]*$/),
  ]);

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    this.uid = this.route.snapshot.params.uid;

    this.store.dispatch(PlayerActions.getByUidRequest({ uid: this.uid }));
    this.store.dispatch(PlayerActions.getStatisticsRequest({ uid: this.uid }));
    this.getTransactions(0);

    this.store.pipe(select(getSelectedPlayer), takeUntil(this.destroy$)).subscribe((player) => {
      this.settingsForm.patchValue(
        {
          name: player.name,
          pro: hasRole(player.roles, Role.Pro),
          single: player.single,
          double: player.double,
          triple: player.triple,
        },
        { emitEvent: false },
      );
      this.avatar.setValue(player.avatar);
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
      .subscribe((players) => (this.players = players));

    this.store
      .pipe(select(getUserCurrency), takeUntil(this.destroy$))
      .subscribe((currency) => (this.currency = currency));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  getTransactions(offset: number) {
    this.store.dispatch(
      PlayerActions.getTransactionsRequest({
        uid: this.uid,
        limit: 15,
        offset,
      }),
    );
  }

  hasRoles(role: Role) {
    return hasRole(this.player.roles, role);
  }

  update(avatar = this.player.avatar) {
    if (this.settingsForm.valid) {
      const { name, pro, single, double, triple } = this.settingsForm.value;
      this.store.dispatch(
        PlayerActions.updateRequest({
          uid: this.uid,
          player: {
            name,
            roles: pro ? [Role.Pro] : [],
            single,
            double,
            triple,
            avatar,
          },
        }),
      );
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

  disablePin() {
    this.store.dispatch(
      CoreActions.confirmPin({
        header: 'Disable PIN',
        text: 'Are you sure you want to disable your PIN code?',
        action: PlayerActions.disablePinRequest({ uid: this.uid }),
        okText: 'Disable PIN',
        okColor: 'error',
        pinDisabled: false,
      }),
    );
  }

  delete() {
    this.store.dispatch(
      CoreActions.confirmPin({
        header: 'Delete player',
        text: `Are you sure you want to delete player <strong>${this.player.name}</strong>? Any remaining funds will be donated to jackpot.`,
        action: PlayerActions.deleteRequest({ uid: this.uid }),
        okText: 'Delete',
        okColor: 'error',
        pinDisabled: false,
      }),
    );
  }

  setTransactionType(type: TransactionType) {
    this.transactionForm.reset();
    this.transactionForm.get('type').setValue(type);
  }

  executeTransaction() {
    const { type, amount, receiverUid } = this.transactionForm.value;
    const currencyAmount = `${this.currency} ${amount.toFixed(2)}`;
    const receiverPlayerName = receiverUid
      ? ` to <strong>${this.players.find(({ uid }) => uid === receiverUid).name}</strong>`
      : '';

    this.store.dispatch(
      CoreActions.confirmPin({
        header: 'Transaction',
        text: `Are you sure you want to ${type} <strong>${currencyAmount}</strong>${receiverPlayerName}?`,
        action: PlayerActions.createTransactionRequest({
          uid: this.uid,
          transaction: { type, amount, receiverUid },
        }),
        pinDisabled: false,
        admin: type !== TransactionType.Transfer,
      }),
    );
  }

  openFileInput() {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }

  uploadAvatar(file: File) {
    this.store.dispatch(
      UserActions.uploadRequest({
        file,
        callback: (url: string) =>
          PlayerActions.updateRequest({
            uid: this.uid,
            player: {
              avatar: url,
              single: this.player.single,
              double: this.player.double,
              triple: this.player.triple,
              name: this.player.name,
              roles: this.player.roles,
            },
          }),
      }),
    );
  }

  verifyEmail() {
    this.store.dispatch(PlayerActions.sendEmailVerificationRequest({ uid: this.uid }));
  }
}
