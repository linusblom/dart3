import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Player, Check, GameType, Role } from 'dart3-sdk';
import { HttpErrorResponse } from '@angular/common/http';

import {
  State,
  getWizardStep,
  getWizardValues,
  getWizardPlayers,
  getGameModuleLoading,
} from '@game/reducers';
import { options, GameWizardStep } from '@game/models';
import { getAllPlayers, getUserCurrency, getUserMetaData } from '@root/reducers';
import { GameActions, WizardActions, CurrentGameActions } from '@game/actions';
import { CoreActions } from '@core/actions';
import { hasRole } from '@utils/player-roles';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  players$ = this.store.pipe(select(getAllPlayers));
  selectedPlayers$ = this.store.pipe(select(getWizardPlayers));
  step$ = this.store.pipe(select(getWizardStep));
  meta$ = this.store.pipe(select(getUserMetaData));
  loading$ = this.store.pipe(select(getGameModuleLoading));

  currency = '';
  options = options;
  type: GameType;
  form = new FormGroup({
    tournament: new FormControl(false, Validators.required),
    startScore: new FormControl(0, Validators.required),
    team: new FormControl(false, Validators.required),
    random: new FormControl(true, Validators.required),
    bet: new FormControl(10, Validators.required),
    sets: new FormControl(1, Validators.required),
    legs: new FormControl(1, Validators.required),
    checkIn: new FormControl(Check.Straight, Validators.required),
    checkOut: new FormControl(Check.Straight, Validators.required),
    tieBreak: new FormControl(0, Validators.required),
  });

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>) {
    this.store
      .pipe(select(getWizardValues), takeUntil(this.destroy$))
      .subscribe(({ type, ...settings }) => {
        this.form.patchValue({ ...settings }, { emitEvent: false });
        this.type = type;
      });

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => this.store.dispatch(WizardActions.setSettings({ settings })));

    this.store
      .pipe(select(getUserCurrency), takeUntil(this.destroy$))
      .subscribe((currency) => (this.currency = currency));
  }

  changeType(gameType: GameType) {
    this.store.dispatch(WizardActions.setType({ gameType }));
  }

  changeStep(step: GameWizardStep) {
    this.store.dispatch(WizardActions.setStep({ step }));
  }

  create() {
    this.store.dispatch(GameActions.createRequest());
  }

  cancel() {
    this.store.dispatch(
      CoreActions.showModal({
        modal: {
          header: 'Cancel',
          text: `Are you sure you want to cancel this game? Bets will be refunded to players.`,
          backdrop: {
            dismiss: true,
          },
          cancel: { text: 'No', dismiss: true },
          ok: {
            text: 'Yes',
            dismiss: true,
            action: () => CurrentGameActions.deleteRequest(),
          },
        },
      }),
    );
  }

  addPlayer(player: Player) {
    const amount = `${this.currency} ${this.form.get('bet').value.toFixed(2)}`;

    this.store.dispatch(
      CoreActions.confirmPin({
        header: 'Payment',
        text: `<strong>${amount}</strong> will be debited from your account.`,
        action: CurrentGameActions.createTeamPlayerRequest({ uid: player.uid }),
        okText: 'Pay',
        cancelAction: CurrentGameActions.createTeamPlayerFailure({
          error: {} as HttpErrorResponse,
        }),
        pinDisabled: !hasRole(player.roles, Role.Pin),
      }),
    );
  }

  removePlayer(player: Player) {
    this.store.dispatch(CurrentGameActions.deleteTeamPlayerRequest({ uid: player.uid }));
  }

  start() {
    this.store.dispatch(CurrentGameActions.startRequest());
  }

  trackByFn(index: number) {
    return index;
  }
}
