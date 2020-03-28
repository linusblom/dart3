import { createAction, props } from '@ngrx/store';
import { Player, CreatePlayer, UpdatePlayer } from 'dart3-sdk';

export const getRequest = createAction('[Player] Get Request');
export const getSuccess = createAction('[Player] Get Success', props<{ players: Player[] }>());
export const getFailure = createAction('[Player] Get Failure');

export const getByIdRequest = createAction('[Player] Get By Id Request', props<{ id: number }>());
export const getByIdSuccess = createAction(
  '[Player] Get By Id Success',
  props<{ player: Player }>(),
);
export const getByIdFailure = createAction('[Player] Get By Id Failure');

export const createRequest = createAction(
  '[Player] Create Request',
  props<{ player: CreatePlayer }>(),
);
export const createSuccess = createAction('[Player] Create Success', props<{ player: Player }>());
export const createFailure = createAction('[Player] Create Failure');

export const updateRequest = createAction(
  '[Player] Update Request',
  props<{ id: number; player: UpdatePlayer }>(),
);
export const updateSuccess = createAction('[Player] Update Success', props<{ player: Player }>());
export const updateFailure = createAction('[Player] Update Failure');

export const resetPinRequest = createAction('[Player] Reset Pin Request', props<{ id: number }>());
export const resetPinSuccess = createAction('[Player] Reset Pin Success');
export const resetPinFailure = createAction('[Player] Reset Pin Failure');

export const deleteRequest = createAction('[Player] Delete Request', props<{ id: number }>());
export const deleteSuccess = createAction('[Player] Delete Success', props<{ id: number }>());
export const deleteFailure = createAction('[Player] Delete Failure');
