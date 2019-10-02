import { createAction, props } from '@ngrx/store';

import { Score } from '@game/models';
import { Player } from '@player/models';

export const valueChangesInit = createAction('[Player] Value Changes Player Init');
export const valueChangesSuccess = createAction(
  '[Player] Value Changes Player Success',
  props<{ players: Player[] }>(),
);
export const valueChangesFailure = createAction('[Player] Value Changes Player Failure');
export const valueChangesDestroy = createAction('[Player] Value Changes Player Destroy');

export const create = createAction('[Player] Create', props<{ name: string }>());
export const createSuccess = createAction('[Player] Create Success');
export const createFailure = createAction('[Player] Create Failure');

export const update = createAction(
  '[Player] Update',
  props<{ id: string; data: Partial<Player> }>(),
);
export const updateSuccess = createAction('[Player] Update Success');
export const updateFailure = createAction('[Player] Update Failure');

export const updateStats = createAction(
  '[Player] Update Stats',
  props<{ id: string; scores: Score[] }>(),
);
export const updateStatsSuccess = createAction('[Player] Update Stats Success');
export const updateStatsFailure = createAction('[Player] Update Stats Failure');

export const updateAvatar = createAction(
  '[Player] Update Avatar',
  props<{ id: string; file: File }>(),
);
export const updateAvatarSuccess = createAction('[Player] Update Avatar Success');
export const updateAvatarFailure = createAction('[Player] Update Avatar Failure');

export const select = createAction('[Player] Select', props<{ id: string }>());
