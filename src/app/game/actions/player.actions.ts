import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, union } from '@ngrx/store';

import { Player } from '@game/models/player';

export const loadPlayers = createAction('[Player] Load Players');
export const loadPlayersSuccess = createAction(
  '[Player] Load Players Success',
  props<{ players: Player[] }>(),
);
export const loadPlayersFailure = createAction(
  '[Player] Load Players Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadPlayersDestroy = createAction('[Player] Load Players Destroy');

export const createPlayer = createAction('[Player] Create Player', props<{ name: string }>());
export const createPlayerSuccess = createAction('[Player] Create Player Success');
export const createPlayerFailure = createAction(
  '[Player] Create Player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updatePlayer = createAction(
  '[Player] Update player',
  props<{ id: string; data: Partial<Player> }>(),
);
export const updatePlayerSuccess = createAction('[Player] Update player Success');
export const updatePlayerFailure = createAction(
  '[Player] Update player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const selectPlayer = createAction('[Player] Select Player', props<{ id: string }>());
