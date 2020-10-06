import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Match, MatchStatus } from 'dart3-sdk';

import { StoreState } from '@shared/models';
import { CurrentGameActions, MatchActions } from '@game/actions';

export interface State extends EntityState<Match> {
  state: StoreState;
  selectedId: number;
}

export const adapter: EntityAdapter<Match> = createEntityAdapter<Match>();

export const initialState: State = adapter.getInitialState({
  state: StoreState.NONE,
  selectedId: null,
});

export const reducer = createReducer(
  initialState,

  on(CurrentGameActions.getRequest, (state) => ({ ...state, selectedId: null })),

  on(CurrentGameActions.getMatchesRequest, (state) => ({
    ...state,
    state: StoreState.FETCHING,
    selectedId: null,
  })),

  on(CurrentGameActions.getMatchesSuccess, (state, { matches }) =>
    adapter.upsertMany(matches, {
      ...state,
      state: StoreState.NONE,
      selectedId: matches.find((game) =>
        [MatchStatus.Playing, MatchStatus.Order].includes(game.status),
      )?.id,
    }),
  ),

  on(CurrentGameActions.getMatchesFailure, (state) => ({ ...state, state: StoreState.NONE })),

  on(MatchActions.updateMatches, (state, { matches }) => adapter.updateMany(matches, state)),

  on(MatchActions.updateMatch, (state, { match }) => adapter.updateOne(match, state)),
);
