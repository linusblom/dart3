import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { RoundHit } from 'dart3-sdk';

import { CurrentGameActions } from '@game/actions';

export interface State extends EntityState<RoundHit> {}

export const adapter: EntityAdapter<RoundHit> = createEntityAdapter<RoundHit>();

export const initialState: State = adapter.getInitialState();

export const reducer = createReducer(
  initialState,

  on(CurrentGameActions.getMatchesSuccess, (state, { hits }) => adapter.upsertMany(hits, state)),

  on(CurrentGameActions.createRoundSuccess, (state, { hits }) =>
    hits.length === 0 ? adapter.removeAll(state) : adapter.upsertMany(hits as RoundHit[], state),
  ),
);
