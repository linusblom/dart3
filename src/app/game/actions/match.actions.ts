import { createAction, props } from '@ngrx/store';
import { Match } from 'dart3-sdk';

export const upsertMatches = createAction('[Game] Upsert Matches', props<{ matches: Match[] }>());
