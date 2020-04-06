import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, catchError } from 'rxjs/operators';
import { Transaction, TransactionType } from 'dart3-sdk';
import { Observable } from 'rxjs';

import { TransactionService } from '@player/services';
import { TransactionActions } from '@player/actions';

@Injectable()
export class TransactionEffects {
  transaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.transactionRequest),
      concatMap(({ id, pin, transaction, toPlayerId }) => {
        let service: () => Observable<Transaction>;

        switch (transaction.type) {
          case TransactionType.Deposit:
          case TransactionType.Withdrawal:
            service = () => this.service.bankToPlayer(id, pin, transaction);
            break;
          case TransactionType.Transfer:
            service = () => this.service.playerToPlayer(id, pin, toPlayerId, transaction);
            break;
          default:
            return [];
        }

        return service().pipe(
          map(transaction => TransactionActions.transactionSuccess({ id, transaction })),
          catchError(error => [TransactionActions.transactionFailure({ error })]),
        );
      }),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: TransactionService) {}
}
