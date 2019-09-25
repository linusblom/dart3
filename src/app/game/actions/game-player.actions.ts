import { createAction, props } from '@ngrx/store';

import { GamePlayer } from '@game/models';

export const valueChangesInit = createAction(
  '[Game Player] Value Changes Init',
  props<{ id: string }>(),
);
export const valueChangesSuccess = createAction(
  '[Game Player] Value Changes Success',
  props<{ players: GamePlayer[] }>(),
);
export const valueChangesFailure = createAction('[Game Player] Value Changes Failure');
export const valueChangesDestroy = createAction('[Game Player] Value Changes Destroy');
