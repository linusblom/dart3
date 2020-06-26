import { createReducer, on } from '@ngrx/store';

import { JackpotActions } from '@jackpot/actions';
import { StoreState } from '@shared/models';

export interface State {
  value: string;
  nextValue: string;
  state: StoreState;
}

export const initialState: State = {
  value: '0.00',
  nextValue: '0.00',
  state: StoreState.NONE,
};

export const reducer = createReducer(
  initialState,

  on(JackpotActions.getCurrentJackpotRequest, state => ({ ...state, state: StoreState.FETCHING })),

  on(JackpotActions.getCurrentJackpotSuccess, (state, { jackpot }) => ({
    ...state,
    state: StoreState.NONE,
    ...jackpot,
  })),

  on(JackpotActions.getCurrentJackpotFailure, state => ({ ...state, state: StoreState.NONE })),
);
