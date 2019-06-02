import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { RoundActions } from '@game/actions';
import { Round } from '@game/models';

export interface State extends EntityState<Round> {
  loading: boolean;
}

export const adapter: EntityAdapter<Round> = createEntityAdapter<Round>({
  selectId: (round: Round) => round.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export const reducer = createReducer(
  initialState,
  on(RoundActions.loadRound, state => ({ ...state, loading: true })),
  on(RoundActions.loadRoundSuccess, (state, { rounds }) =>
    adapter.upsertMany(rounds, { ...state, loading: false }),
  ),
  on(RoundActions.loadRoundFailure, state => ({ ...state, loading: false })),
  on(RoundActions.loadRoundDestroy, state => adapter.removeAll(state)),
);

export const getLoading = (state: State) => state.loading;
