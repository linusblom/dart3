import { createReducer, on } from '@ngrx/store';

import { JackpotActions } from '@jackpot/actions';
import { StoreState } from '@shared/models';

export interface State {
  id: number;
  value: string;
  nextValue: string;
  state: StoreState;
  gems: boolean[];
  playerIds: number[];
}

export const initialState: State = {
  id: undefined,
  value: '0.00',
  nextValue: '0.00',
  state: StoreState.NONE,
  gems: [],
  playerIds: [],
};

export const reducer = createReducer(
  initialState,

  on(JackpotActions.getCurrentRequest, (state) => ({
    ...state,
    state: StoreState.FETCHING,
  })),

  on(JackpotActions.getCurrentSuccess, (state, { jackpot }) => ({
    ...state,
    state: StoreState.NONE,
    ...jackpot,
  })),

  on(JackpotActions.getCurrentFailure, (state) => ({ ...state, state: StoreState.NONE })),

  on(JackpotActions.start, (state, { jackpot }) => ({ ...state, ...jackpot })),

  on(JackpotActions.reset, (state) => ({ ...state, value: state.nextValue, nextValue: '0.00' })),
);
