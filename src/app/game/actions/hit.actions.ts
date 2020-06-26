import { createAction, props } from '@ngrx/store';
import { RoundHit } from 'dart3-sdk';

export const upsertHits = createAction('[Game] Upsert Hits', props<{ hits: RoundHit[] }>());
export const removeHits = createAction('[Game] Remove Hits');
