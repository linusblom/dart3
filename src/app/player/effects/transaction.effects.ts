import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Transaction, TransactionType } from 'dart3-sdk';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { TransactionService } from '@player/services';
import { TransactionActions } from '@player/actions';
import { State, getPin } from '@root/reducers';

@Injectable()
export class TransactionEffects {
  transaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.transactionRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ id, transaction, toPlayerId }, pin]) => {
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

  constructor(
    private readonly actions$: Actions,
    private readonly service: TransactionService,
    private readonly store: Store<State>,
  ) {}
}
