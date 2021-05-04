import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import {
  CreatePlayer,
  CreateTransaction,
  Pagination,
  Player,
  PlayerStats,
  Transaction,
  UpdatePlayer,
} from 'dart3-sdk';

export const getRequest = createAction('[Player] Get Request');
export const getSuccess = createAction('[Player] Get Success', props<{ players: Player[] }>());
export const getFailure = createAction(
  '[Player] Get Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const getByUidRequest = createAction(
  '[Player] Get By Uid Request',
  props<{ uid: string }>(),
);
export const getByUidSuccess = createAction(
  '[Player] Get By Uid Success',
  props<{ player: Player }>(),
);
export const getByUidFailure = createAction(
  '[Player] Get By Uid Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const createRequest = createAction(
  '[Player] Create Request',
  props<{ player: CreatePlayer }>(),
);
export const createSuccess = createAction('[Player] Create Success', props<{ player: Player }>());
export const createFailure = createAction(
  '[Player] Create Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updateRequest = createAction(
  '[Player] Update Request',
  props<{ uid: string; player: UpdatePlayer }>(),
);
export const updateSuccess = createAction(
  '[Player] Update Success',
  props<{ player: Update<Player> }>(),
);
export const updateFailure = createAction(
  '[Player] Update Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const resetPinRequest = createAction('[Player] Reset Pin Request', props<{ uid: string }>());
export const resetPinSuccess = createAction('[Player] Reset Pin Success', props<{ uid: string }>());
export const resetPinFailure = createAction(
  '[Player] Reset Pin Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const disablePinRequest = createAction(
  '[Player] Disable Pin Request',
  props<{ uid: string }>(),
);
export const disablePinSuccess = createAction(
  '[Player] Disable Pin Success',
  props<{ uid: string }>(),
);
export const disablePinFailure = createAction(
  '[Player] Disable Pin Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const deleteRequest = createAction('[Player] Delete Request', props<{ uid: string }>());
export const deleteSuccess = createAction('[Player] Delete Success', props<{ uid: string }>());
export const deleteFailure = createAction(
  '[Player] Delete Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const createTransactionRequest = createAction(
  '[Player] Create Transaction Request',
  props<{ uid: string; transaction: CreateTransaction }>(),
);
export const createTransactionSuccess = createAction(
  '[Player] Create Transaction Success',
  props<{ uid: string; balance: string }>(),
);
export const createTransactionFailure = createAction(
  '[Player] Create Transaction Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updateById = createAction(
  '[Player] Update By Id',
  props<{ id: number; changes: Partial<Player> }>(),
);

export const getTransactionsRequest = createAction(
  '[Player] Get Transactions Request',
  props<{ uid: string; limit: number; offset: number }>(),
);
export const getTransactionsSuccess = createAction(
  '[Player] Get Transactions Success',
  props<{ uid: string; transactions: Pagination<Transaction> }>(),
);
export const getTransactionsFailure = createAction(
  '[Player] Get Transactions Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const getStatisticsRequest = createAction(
  '[Player] Get Statistics Request',
  props<{ uid: string }>(),
);
export const getStatisticsSuccess = createAction(
  '[Player] Get Statistics Success',
  props<{ uid: string; statistics: PlayerStats }>(),
);
export const getStatisticsFailure = createAction(
  '[Player] Get Statistics Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const sendEmailVerificationRequest = createAction(
  '[Player] Send Email Verification Request',
  props<{ uid: string }>(),
);
export const sendEmailVerificationSuccess = createAction(
  '[Player] Send Email Verification Success',
);
export const sendEmailVerificationFailure = createAction(
  '[Player] Send Email Verification Failure',
);
