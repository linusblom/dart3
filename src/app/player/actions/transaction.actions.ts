import { HttpErrorResponse } from '@angular/common/http';
import { props, createAction } from '@ngrx/store';
import { TransactionPayload, Transaction } from 'dart3-sdk';

export const transactionRequest = createAction(
  '[Transaction] Transaction Request',
  props<{ id: number; transaction: TransactionPayload; toPlayerId?: number; toGameId?: number }>(),
);
export const transactionSuccess = createAction(
  '[Transaction] Transaction Success',
  props<{ id: number; transaction: Transaction }>(),
);
export const transactionFailure = createAction(
  '[Player] Bank To Player Failure',
  props<{ error: HttpErrorResponse }>(),
);
