import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Match, MatchStatus } from 'dart3-sdk';

import { StoreState } from '@shared/models';
import { CurrentGameActions } from '@game/actions';

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

  on(CurrentGameActions.getMatchesRequest, state => ({ ...state, state: StoreState.FETCHING })),

  on(CurrentGameActions.getMatchesSuccess, (state, { matches }) =>
    adapter.upsertMany(matches, {
      ...state,
      state: StoreState.NONE,
      selectedId: matches.find(game => game.status === MatchStatus.Playing)?.id,
    }),
  ),

  on(CurrentGameActions.getMatchesFailure, state => ({ ...state, state: StoreState.NONE })),

  on(CurrentGameActions.createRoundSuccess, (state, { match }) => adapter.upsertOne(match, state)),
);
