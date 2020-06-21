import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MatchTeam } from 'dart3-sdk';

import { CurrentGameActions, TeamActions } from '@game/actions';

export interface State extends EntityState<MatchTeam> {}

export const adapter: EntityAdapter<MatchTeam> = createEntityAdapter<MatchTeam>();

export const initialState: State = adapter.getInitialState();

export const reducer = createReducer(
  initialState,

  on(CurrentGameActions.getMatchesSuccess, TeamActions.upsertTeams, (state, { teams }) =>
    adapter.upsertMany(teams, state),
  ),
);
