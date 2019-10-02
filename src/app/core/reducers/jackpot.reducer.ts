import { createReducer, on } from '@ngrx/store';

import { JackpotActions } from '@core/actions';

export interface State {
  value: number;
  next: number;
  started: number;
  ended: number;
  playerId: string;
}

export const initialState: State = {
  value: 0,
  next: 0,
  started: 0,
  ended: 0,
  playerId: null,
};

export const reducer = createReducer(
  initialState,
  on(JackpotActions.valueChangesSuccess, (state, { jackpot }) => ({ ...state, ...jackpot })),
);
