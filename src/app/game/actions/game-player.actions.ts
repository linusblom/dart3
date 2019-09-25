import { createAction, props } from '@ngrx/store';

import { GamePlayer } from '@game/models';

export const valueChangesInit = createAction(
  '[Game Player] Game Players Value Changes Init',
  props<{ id: string }>(),
);
export const valueChangesSuccess = createAction(
  '[Game Player] Game Players Value Changes Success',
  props<{ players: GamePlayer[] }>(),
);
export const valueChangesFailure = createAction('[Game Player] Game Players Value Changes Failure');
export const valueChangesDestroy = createAction('[Game Player] Game Players Value Changes Destroy');
