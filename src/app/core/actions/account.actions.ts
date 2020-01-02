import { createAction, props } from '@ngrx/store';
import { Account } from 'dart3-sdk';

export const valueChangesInit = createAction('[Account] Value Changes Init');
export const valueChangesSuccess = createAction(
  '[Account] Value Changes Success',
  props<{ account: Account }>(),
);
export const valueChangesFailure = createAction('[Account] Value Changes Failure');
export const valueChangesDestroy = createAction('[Account] Value Changes Destroy');

export const update = createAction('[Account] Update Account', props<{ data: Partial<Account> }>());
export const updateSuccess = createAction('[Account] Update Account Success');
export const updateFailure = createAction('[Account] Update Account Failure');
