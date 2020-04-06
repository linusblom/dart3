import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';

import { PlayerActions, TransactionActions } from '@player/actions';
import { CoreActions } from '@core/actions';

@Injectable()
export class CoreEffects {
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
            header: 'Insufficient Credits',
            text: "You don't have enough credits to perform this transaction.",
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
