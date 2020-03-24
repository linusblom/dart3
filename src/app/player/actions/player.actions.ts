import { createAction, props } from '@ngrx/store';
import { Player, CreatePlayer } from 'dart3-sdk';

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
