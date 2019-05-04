import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, union } from '@ngrx/store';

import { Player } from '@game/models/player';

export const loadPlayers = createAction('[Players] Load Players');
export const loadPlayersSuccess = createAction(
  '[Players] Load Players Success',
  props<{ players: Player[] }>(),
);
export const loadPlayersFailure = createAction(
  '[Players] Load Players Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadPlayersDestroy = createAction('[Players] Load Players Destroy');

export const createPlayer = createAction('[Players] Create Player', props<{ name: string }>());
export const createPlayerSuccess = createAction('[Player] Create Player Success');
export const createPlayerFailue = createAction(
  '[Player] Create Player Failure',
  props<{ error: HttpErrorResponse }>(),
);
