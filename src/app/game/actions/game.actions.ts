import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { Game, ListOptions } from '@game/models';

export const get = createAction('[Game] Get', props<{ id: string }>());
export const getSuccess = createAction('[Game] Get Success', props<{ game: Game }>());
export const getFailure = createAction('[Game] Get Failure');

export const list = createAction('[Game] List Games', props<{ options: ListOptions }>());
export const listSuccess = createAction('[Game] List Success', props<{ games: Game[] }>());
export const listFailure = createAction('[Game] List Success');

export const getGamePlayers = createAction('[Game] Get Game Players', props<{ ids: string[] }>());
export const getGamePlayersSuccess = createAction(
  '[Game] Get Game Players Success',
  props<{ updates: Update<Game>[] }>(),
);
export const getGamePlayersFailure = createAction('[Game] Get Game Players Failure');
