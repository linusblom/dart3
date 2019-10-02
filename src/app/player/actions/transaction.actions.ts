import { createAction, props } from '@ngrx/store';

import { Transaction, TransactionPayload } from '@player/models';

export const create = createAction(
  '[Transaction] Create',
  props<{ id: string; transaction: TransactionPayload }>(),
);
export const createSuccess = createAction('[Transaction] Create Success');
export const createFailure = createAction('[Transaction] Create Failure');

export const valueChangesInit = createAction(
  '[Transaction] Value Changes Init',
  props<{ id: string }>(),
);
export const valueChangesSuccess = createAction(
  '[Transaction] Value Changes Success',
  props<{ transactions: Transaction[] }>(),
);
export const valueChangesFailure = createAction('[Transaction] Value Changes Failure');
export const valueChangesDestroy = createAction('[Transaction] Value Changes Destroy');
