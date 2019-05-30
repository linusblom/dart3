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

  createTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.createTransaction),
      exhaustMap(({ playerId, transaction: { type, amount } }) =>
        from(this.service.create(playerId, type, amount)).pipe(
          map(() => TransactionActions.createTransactionSuccess()),
          catchError(error => [
            TransactionActions.createTransaction(error),
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
        this.service.listen(playerId).pipe(
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
