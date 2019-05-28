import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, takeUntil } from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { TransactionActions } from '@game/actions';
import { Transaction } from '@game/models';
import { TransactionService } from '@game/services';

@Injectable()
export class TransactionEffects {
  constructor(private readonly actions$: Actions, private readonly service: TransactionService) {}

  transaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.transaction),
      exhaustMap(({ playerId, transaction: { type, amount } }) =>
        from(this.service.transaction(playerId, type, amount)).pipe(
          map(() => TransactionActions.transactionSuccess()),
          catchError(error => [
            TransactionActions.transactionFailure(error),
            NotificationActions.push({ status: Status.ERROR, message: error.message }),
          ]),
        ),
      ),
    ),
  );

  loadTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.loadTransactions),
      switchMap(({ playerId }) =>
        this.service.list(playerId).pipe(
          takeUntil(this.actions$.pipe(ofType(TransactionActions.loadTransactionsDestroy))),
          map((transactions: Transaction[]) =>
            TransactionActions.loadTransactionsSuccess({ transactions }),
          ),
          catchError(error => [TransactionActions.loadTransactionsFailure(error)]),
        ),
      ),
    ),
  );
}
