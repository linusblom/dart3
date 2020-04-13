import { createAction, props } from '@ngrx/store';
import { Game } from 'dart3-sdk';
import { HttpErrorResponse } from '@angular/common/http';

export const getCurrentRequest = createAction('[Game] Get Current Request');
export const getCurrentSuccess = createAction(
  '[Game] Get Current Success',
  props<{ game: Game }>(),
);
export const getCurrentFailure = createAction(
  '[Game] Get Current Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const createRequest = createAction('[Game] Create Request');
export const createSuccess = createAction('[Game] Create Success', props<{ game: Game }>());
export const createFailure = createAction('[Game] Create Failure');

export const deleteRequest = createAction('[Game] Delete Request', props<{ id: number }>());
export const deleteSuccess = createAction('[Game] Delete Success');
export const deleteFailure = createAction('[Game] Delete Failure');
