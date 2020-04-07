import { createAction, props } from '@ngrx/store';
import { User } from 'dart3-sdk';

export const getRequest = createAction('[User] Get Request');
export const getSuccess = createAction('[User] Get Success', props<{ user: User }>());
export const getFailure = createAction('[User] Get Failure');

export const updateRequest = createAction(
  '[User] Update Request',
  props<{ user: Partial<User> }>(),
);
export const updateSuccess = createAction('[User] Update Success', props<{ user: User }>());
export const updateFailure = createAction('[User] Update Failure');
