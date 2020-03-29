import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Player } from 'dart3-sdk';
import { Subject } from 'rxjs';

import { State, getSelectedPlayer } from '@root/reducers';
import { PlayerActions } from '@player/actions';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CoreActions } from '@core/actions';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnDestroy {
  id = 0;
  player = {} as Player;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;

    this.store.dispatch(PlayerActions.getByIdRequest({ id: this.id }));

    this.store.pipe(select(getSelectedPlayer), takeUntil(this.destroy$)).subscribe(player => {
      this.form.patchValue({
        name: player.name,
        email: player.email,
      });
      this.player = player;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  update() {
    if (this.form.valid) {
      this.store.dispatch(PlayerActions.updateRequest({ id: this.id, player: this.form.value }));
    }
  }

  resetPin() {
    this.store.dispatch(
      CoreActions.showModal({
        modal: {
          header: 'Reset PIN',
          text: `Are you sure you want to reset your PIN code? New PIN code will be sent to ${this.player.email}`,
          backdrop: {
            dismiss: true,
          },
          cancel: { dismiss: true },
          ok: {
            text: 'Send PIN',
            color: 'error',
            dismiss: true,
            action: () => PlayerActions.resetPinRequest({ id: this.id }),
          },
        },
      }),
    );
  }

  delete() {
    this.store.dispatch(
      CoreActions.showModal({
        modal: {
          header: 'Delete player',
          text: `Are you sure you want to delete player ${this.player.name}? Please enter PIN to confirm.`,
          backdrop: {
            dismiss: true,
          },
          cancel: { text: 'Cancel', dismiss: true },
          ok: {
            text: 'Delete',
            color: 'error',
            dismiss: true,
            action: (pin: string) => PlayerActions.deleteRequest({ id: this.id, pin }),
          },
          pin: true,
        },
      }),
    );
  }
}
