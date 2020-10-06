import { createAction, props } from '@ngrx/store';
import { RoundHit } from 'dart3-sdk';

export const upsertHits = createAction('[Hit] Upsert Hits', props<{ hits: RoundHit[] }>());
export const removeHits = createAction('[Hit] Remove Hits');
