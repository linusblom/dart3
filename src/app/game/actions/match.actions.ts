import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Match } from 'dart3-sdk';

export const updateMatches = createAction(
  '[Game] Update Matches',
  props<{ matches: Update<Match>[] }>(),
);
