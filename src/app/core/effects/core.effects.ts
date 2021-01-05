import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { PlayerActions } from '@player/actions';
import { CoreActions } from '@core/actions';
import { CurrentGameActions } from '@game/actions';
import { UserActions } from '@user/actions';

@Injectable()
export class CoreEffects {
  confirmPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.confirmPin),
      map((modal) => {
        const text = modal.admin
          ? `${modal.text}<br/><br/>This action <strong>requires an admin</strong>. Please enter admin PIN to confirm.`
          : `${modal.text} ${
              !modal.pinDisabled ? '<br/><br/>Please enter your PIN to confirm.' : ''
            }`;

        return CoreActions.showModal({
          modal: {
            header: modal.header,
            text,
            backdrop: {
              dismiss: true,
              ...(modal.cancelAction && { action: () => modal.cancelAction }),
            },
            cancel: {
              text: 'Cancel',
              dismiss: true,
              ...(modal.cancelAction && { action: () => modal.cancelAction }),
            },
            ok: {
              text: modal.okText || 'Confirm',
              color: modal.okColor,
              dismiss: true,
              action: (pin: string) =>
                CoreActions.confirmPinDispatch({ pin, action: modal.action }),
            },
            pin: modal.admin || !modal.pinDisabled,
          },
        });
      }),
    ),
  );

  confirmPinDispatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.confirmPinDispatch),
      switchMap(({ action }) => [action, CoreActions.confirmPinComplete()]),
    ),
  );

  invalidPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PlayerActions.deleteFailure,
        PlayerActions.transactionFailure,
        PlayerActions.disablePinFailure,
        CurrentGameActions.createTeamPlayerFailure,
      ),
      filter(({ error: { status } }) => status === 403),
      map(() =>
        CoreActions.showModal({
          modal: {
            header: 'Invalid PIN',
            text: 'PIN code entered is invalid.',
            backdrop: {
              dismiss: true,
            },
            ok: {
              dismiss: true,
            },
          },
        }),
      ),
    ),
  );

  invalidFileType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.uploadFailure),
      filter(({ error: { status } }) => status === 415),
      map(() =>
        CoreActions.showModal({
          modal: {
            header: 'Invalid image',
            text: 'Allowed images: gif, jpeg, png',
            backdrop: {
              dismiss: true,
            },
            ok: {
              dismiss: true,
            },
          },
        }),
      ),
    ),
  );

  insufficientFunds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.transactionFailure, CurrentGameActions.createTeamPlayerFailure),
      filter(({ error: { status } }) => status === 406),
      map(() =>
        CoreActions.showModal({
          modal: {
            header: 'Insufficient Funds',
            text: "You don't have enough funds to perform this transaction.",
            backdrop: {
              dismiss: true,
            },
            ok: {
              dismiss: true,
            },
          },
        }),
      ),
    ),
  );

  playSound$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CoreActions.playSound),
        tap(({ sound }) => {
          const audio = new Audio(`../../../../assets/${sound}`);
          audio.load();
          audio.play();
        }),
      ),
    { dispatch: false },
  );

  constructor(private readonly actions$: Actions) {}
}
