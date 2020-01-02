import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Transaction } from 'dart3-sdk';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, takeUntil } from 'rxjs/operators';

import { TransactionActions } from '@player/actions';
import { TransactionService } from '@player/services';

@Injectable()
export class TransactionEffects {
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.create),
      exhaustMap(({ id, transaction: { type, amount } }) =>
        from(this.service.create(id, type, amount)).pipe(
          map(() => TransactionActions.createSuccess()),
          catchError(() => [TransactionActions.createFailure()]),
        ),
      ),
    ),
  );

  valueChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.valueChangesInit),
      switchMap(({ id }) =>
        this.service.valueChanges(id).pipe(
          takeUntil(this.actions$.pipe(ofType(TransactionActions.valueChangesDestroy))),
          map((transactions: Transaction[]) =>
            transactions.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
          ),
          map((transactions: Transaction[]) =>
            TransactionActions.valueChangesSuccess({ transactions }),
          ),
          catchError(() => [TransactionActions.valueChangesFailure()]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: TransactionService) {}
}
