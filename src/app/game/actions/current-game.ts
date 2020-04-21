import { createAction, props } from '@ngrx/store';
import { Game, GamePlayer } from 'dart3-sdk';
import { HttpErrorResponse } from '@angular/common/http';

export const getRequest = createAction('[Current Game] Get Request');
export const getSuccess = createAction('[Current Game] Get Success', props<{ game: Game }>());
export const getFailure = createAction(
  '[Current Game] Get Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const deleteRequest = createAction('[Current Game] Delete Request');
export const deleteSuccess = createAction('[Current Game] Delete Success');
export const deleteFailure = createAction('[Current Game] Delete Failure');

export const createGamePlayerRequest = createAction(
  '[Current Game] Create Game Player Request',
  props<{ playerId: number }>(),
);
export const createGamePlayerSuccess = createAction(
  '[Current Game] Create Game Player Success',
  props<{ players: GamePlayer[] }>(),
);
export const createGamePlayerFailure = createAction(
  '[Current Game] Create Game Player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const deleteGamePlayerRequest = createAction(
  '[Current Game] Delete Game Player Request',
  props<{ playerId: number }>(),
);
export const deleteGamePlayerSuccess = createAction(
  '[Current Game] Delete Game Player Success',
  props<{ players: GamePlayer[] }>(),
);
export const deleteGamePlayerFailure = createAction(
  '[Current Game] Delete Game Player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const startRequest = createAction('[Current Game] Start Request');
export const startSuccess = createAction('[Current Game] Start Success');
export const startFailure = createAction('[Current Game] Start Failure');
