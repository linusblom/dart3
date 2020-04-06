import { createAction, props } from '@ngrx/store';
import { Account } from 'dart3-sdk';

export const getRequest = createAction('[Account] Get Request');
export const getSuccess = createAction('[Account] Get Success', props<{ account: Account }>());
export const getFailure = createAction('[Account] Get Failure');
