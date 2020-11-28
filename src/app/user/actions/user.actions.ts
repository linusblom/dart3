import { Action, createAction, props } from '@ngrx/store';
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

export const uploadRequest = createAction(
  '[Player] Upload Request',
  props<{ file: File; callback: (url: string) => Action }>(),
);
export const uploadSuccess = createAction('[Player] Upload Success');
export const uploadFailure = createAction('[Player] Upload Failure');
