import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Match } from 'dart3-sdk';

export const updateMatches = createAction(
  '[Match] Update Matches',
  props<{ matches: Update<Match>[] }>(),
);

export const updateMatch = createAction('[Match] Update Match', props<{ match: Update<Match> }>());
