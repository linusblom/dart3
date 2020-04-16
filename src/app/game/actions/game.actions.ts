import { createAction, props } from '@ngrx/store';
import { Game, GamePlayer } from 'dart3-sdk';
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

export const deleteCurrentRequest = createAction('[Game] Delete Current Request');
export const deleteCurrentSuccess = createAction('[Game] Delete Current Success');
export const deleteCurrentFailure = createAction('[Game] Delete Current Failure');

export const createCurrentGamePlayerRequest = createAction(
  '[Game] Create Current Game Player Request',
  props<{ playerId: number }>(),
);
export const createCurrentGamePlayerSuccess = createAction(
  '[Game] Create Current Game Player Success',
  props<{ players: GamePlayer[] }>(),
);
export const createCurrentGamePlayerFailure = createAction(
  '[Game] Create Current Game Player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const deleteCurrentGamePlayerRequest = createAction(
  '[Game] Delete Current Game Player Request',
  props<{ playerId: number }>(),
);
export const deleteCurrentGamePlayerSuccess = createAction(
  '[Game] Delete Current Game Player Success',
  props<{ players: GamePlayer[] }>(),
);
export const deleteCurrentGamePlayerFailure = createAction(
  '[Game] Delete Current Game Player Failure',
  props<{ error: HttpErrorResponse }>(),
);
