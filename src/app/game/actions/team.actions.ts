import { createAction, props } from '@ngrx/store';
import { MatchTeam } from 'dart3-sdk';

export const upsertTeams = createAction('[Game] Upsert Teams', props<{ teams: MatchTeam[] }>());
