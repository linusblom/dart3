import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { MatchTeam } from 'dart3-sdk';

export const updateTeams = createAction(
  '[Game] Update Teams',
  props<{ teams: Update<MatchTeam>[] }>(),
);
