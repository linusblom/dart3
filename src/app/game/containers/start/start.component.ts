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
import { getAllPlayers } from '@root/reducers';
import { GameActions, WizardActions, CurrentGameActions } from '@game/actions';
import { CoreActions } from '@core/actions';
import { CurrencyPipe } from '@shared/pipes/currency.pipe';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  players$ = this.store.pipe(select(getAllPlayers));
  selectedPlayers$ = this.store.pipe(select(getWizardPlayers));
  step$ = this.store.pipe(select(getWizardStep));

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

  constructor(private readonly store: Store<State>, private readonly currency: CurrencyPipe) {
    this.store
      .pipe(select(getWizardValues), takeUntil(this.destroy$), distinctUntilChanged(isEqual))
      .subscribe(values => this.form.patchValue({ ...values }, { emitEvent: false }));

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ type: _type, ...rest }) =>
        this.store.dispatch(WizardActions.setValues({ _type, ...rest })),
      );
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
    const amount = this.currency.transform(this.form.get('bet').value);

    this.store.dispatch(
      CoreActions.confirmPin({
        header: 'Payment',
        text: `<strong>${amount}</strong> will be debited from your account.`,
        action: CurrentGameActions.createTeamPlayerRequest({ playerId: player.id }),
        okText: 'Pay',
        cancelAction: CurrentGameActions.createTeamPlayerFailure({
          error: {} as HttpErrorResponse,
        }),
      }),
    );
  }

  removePlayer(player: Player) {
    this.store.dispatch(CurrentGameActions.deleteTeamPlayerRequest({ playerId: player.id }));
  }

  start() {
    this.store.dispatch(CurrentGameActions.startRequest());
  }

  trackByFn(index: number) {
    return index;
  }
}
