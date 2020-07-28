import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { PlayerActions } from '@player/actions';
import { CoreActions } from '@core/actions';
import { CurrentGameActions } from '@game/actions';

@Injectable()
export class CoreEffects {
  confirmPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.confirmPin),
      map(({ header, text, okText, okColor, action, cancelAction }) =>
        CoreActions.showModal({
          modal: {
            header,
            text: `${text} Please enter PIN to confirm.`,
            backdrop: { dismiss: true, ...(cancelAction && { action: () => cancelAction }) },
            cancel: {
              text: 'Cancel',
              dismiss: true,
              ...(cancelAction && { action: () => cancelAction }),
            },
            ok: {
              text: okText || 'Confirm',
              color: okColor,
              dismiss: true,
              action: (pin: string) => CoreActions.confirmPinDispatch({ pin, action }),
            },
            pin: true,
          },
        }),
      ),
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
