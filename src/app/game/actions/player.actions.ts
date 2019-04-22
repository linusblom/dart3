import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, union } from '@ngrx/store';

import { Player } from '@game/models/player';

export const loadPlayers = createAction('[Game] Load Players');
export const loadPlayersSuccess = createAction(
  '[Game] Load Players Success',
  props<{ players: Player[] }>(),
);
export const loadPlayersDestroy = createAction('[Game] Load Players Destroy');
export const loadPlayerFailure = createAction(
  '[Game] Load Players Failure',
  props<{ error: HttpErrorResponse }>(),
);

const actions = union({
  loadPlayers,
  loadPlayersSuccess,
});
export type PlayerActionsUnion = typeof actions;
