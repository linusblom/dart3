import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { Transaction, TransactionPayload } from '@game/models';

export const createTransaction = createAction(
  '[Transaction] Create Transaction',
  props<{ playerId: string; transaction: TransactionPayload }>(),
);
export const createTransactionSuccess = createAction('[Transaction] Create Transaction Success');
export const createTransactionFailure = createAction(
  '[Transaction] Create Transaction Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const loadTransactions = createAction(
  '[Transaction] Load Transactions',
  props<{ playerId: string }>(),
);
export const loadTransactionsSuccess = createAction(
  '[Transaction] Load Transactions Success',
  props<{ transactions: Transaction[] }>(),
);
export const loadTransactionsFailure = createAction(
  '[Transaction] Load Transactions Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadTransactionsDestroy = createAction('[Transaction] Load Transactions Destroy');
