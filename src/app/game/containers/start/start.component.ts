import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { isEqual } from 'lodash';
import { Player } from 'dart3-sdk';
import { HttpErrorResponse } from '@angular/common/http';

import { State, getWizardStep, getWizardValues, getWizardPlayers } from '@game/reducers';
import { availableGames, GameWizardStep } from '@game/models';
import { getAllPlayers, getUserCurrency } from '@root/reducers';
import { GameActions, WizardActions, CurrentGameActions } from '@game/actions';
import { CoreActions } from '@core/actions';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  players$ = this.store.pipe(select(getAllPlayers));
  selectedPlayers$ = this.store.pipe(select(getWizardPlayers));
  step$ = this.store.pipe(select(getWizardStep));

  currency = '';
  options = availableGames;
  form = new FormGroup({
    type: new FormControl('', Validators.required),
    tournament: new FormControl(false, Validators.required),
    team: new FormControl(false, Validators.required),
    bet: new FormControl(10, Validators.required),
    sets: new FormControl(1, Validators.required),
    legs: new FormControl(1, Validators.required),
  });

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>) {
    this.store
      .pipe(select(getWizardValues), takeUntil(this.destroy$), distinctUntilChanged(isEqual))
      .subscribe(values => this.form.patchValue({ ...values }, { emitEvent: false }));

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ type: _type, ...rest }) =>
        this.store.dispatch(WizardActions.setValues({ _type, ...rest })),
      );

    this.store
      .pipe(select(getUserCurrency), takeUntil(this.destroy$))
      .subscribe(currency => (this.currency = currency));
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
          text: `Are you sure you want to cancel this game?`,
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
