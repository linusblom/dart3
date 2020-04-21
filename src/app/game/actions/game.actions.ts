import { createAction, props } from '@ngrx/store';
import { Game } from 'dart3-sdk';

export const createRequest = createAction('[Game] Create Request');
export const createSuccess = createAction('[Game] Create Success', props<{ game: Game }>());
export const createFailure = createAction('[Game] Create Failure');
