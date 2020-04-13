import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs/operators';

import { PlayerActions, TransactionActions } from '@player/actions';
import { CoreActions } from '@core/actions';

@Injectable()
export class CoreEffects {
  confirmPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.confirmPin),
      map(({ header, text, okText, okColor, action }) =>
        CoreActions.showModal({
          modal: {
            header,
            text: `${text} Please enter PIN to confirm.`,
            backdrop: { dismiss: true },
            cancel: { text: 'Cancel', dismiss: true },
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
      ofType(PlayerActions.deleteFailure, TransactionActions.transactionFailure),
      filter(({ error: { status } }) => status === 401),
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

  insufficientCredits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.transactionFailure),
      filter(({ error: { status } }) => status === 400),
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

  constructor(private readonly actions$: Actions) {}
}
