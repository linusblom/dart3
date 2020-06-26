import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Game } from 'dart3-sdk';

export const createRequest = createAction('[Game] Create Request');
export const createSuccess = createAction('[Game] Create Success', props<{ game: Game }>());
export const createFailure = createAction('[Game] Create Failure');

export const updateGame = createAction('[Game] Update Game', props<{ game: Update<Game> }>());

export const getByUidRequest = createAction('[Game] Get By Uid Request', props<{ uid: string }>());
export const getByUidSuccess = createAction('[Game] Get By Uid Success', props<{ game: Game }>());
export const getByUidFailure = createAction('[Game] Get By Uid Failure');
