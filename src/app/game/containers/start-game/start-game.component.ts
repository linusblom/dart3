import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { isEqual } from 'lodash';

import { State, getWizardStep, getWizardValues, getWizardId } from '@game/reducers';
import { availableGames, GameWizardStep } from '@game/models';
import { getAllPlayers } from '@root/reducers';
import { GameActions, WizardActions } from '@game/actions';
import { CoreActions } from '@core/actions';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent {
  players$ = this.store.pipe(select(getAllPlayers));
  step$ = this.store.pipe(select(getWizardStep));

  id: number = undefined;
  games = availableGames;
  form = new FormGroup({
    variant: new FormControl('', Validators.required),
    bet: new FormControl(10, Validators.required),
    sets: new FormControl(1, Validators.required),
    legs: new FormControl(1, Validators.required),
  });

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>) {
    this.store
      .pipe(select(getWizardValues), takeUntil(this.destroy$), distinctUntilChanged(isEqual))
      .subscribe(({ variant, bet, sets, legs }) =>
        this.form.patchValue({ variant, bet, sets, legs }, { emitEvent: false }),
      );

    this.store.pipe(select(getWizardId), takeUntil(this.destroy$)).subscribe(id => (this.id = id));

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ variant, bet, sets, legs }) =>
        this.store.dispatch(WizardActions.setValues({ variant, bet, sets, legs })),
      );
  }

  changeStep(step: GameWizardStep) {
    this.store.dispatch(WizardActions.setStep({ step }));
  }

  create() {
    this.store.dispatch(GameActions.createRequest());
  }

  cancel() {
    if (this.id) {
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
              action: () => GameActions.deleteRequest({ id: this.id }),
            },
          },
        }),
      );
    }
  }

  trackByFn(index: number) {
    return index;
  }
}
