import { createAction, props } from '@ngrx/store';
import {
  Player,
  CreatePlayer,
  UpdatePlayer,
  TransactionType,
  CreateTransaction,
  Transaction,
} from 'dart3-sdk';
import { HttpErrorResponse } from '@angular/common/http';

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
export const updateSuccess = createAction('[Player] Update Success', props<{ player: Player }>());
export const updateFailure = createAction(
  '[Player] Update Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const resetPinRequest = createAction('[Player] Reset Pin Request', props<{ uid: string }>());
export const resetPinSuccess = createAction('[Player] Reset Pin Success');
export const resetPinFailure = createAction(
  '[Player] Reset Pin Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const deleteRequest = createAction('[Player] Delete Request', props<{ uid: string }>());
export const deleteSuccess = createAction('[Player] Delete Success', props<{ uid: string }>());
export const deleteFailure = createAction(
  '[Player] Delete Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const transactionRequest = createAction(
  '[Player] Transaction Request',
  props<{
    uid: string;
    _type: TransactionType;
    transaction: CreateTransaction;
    receiverUid?: string;
  }>(),
);
export const transactionSuccess = createAction(
  '[Player] Transaction Success',
  props<{ uid: string; transaction: Transaction }>(),
);
export const transactionFailure = createAction(
  '[Player] Transaction Failure',
  props<{ error: HttpErrorResponse }>(),
);
