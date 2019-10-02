import { createAction, props } from '@ngrx/store';

import { Game } from '@game/models';

export const get = createAction('[Game] Get Game', props<{ id: string }>());
export const getSuccess = createAction('[Game] Get Success', props<{ game: Game }>());
export const getFailure = createAction('[Game] Get Failure');
