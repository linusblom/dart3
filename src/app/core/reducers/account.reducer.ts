import { createReducer, on } from '@ngrx/store';

import { AccountActions } from '@core/actions';
import { Account } from '@core/models';

export interface State extends Account {
  loading: boolean;
}

export const initialState: State = {
  created: 0,
  currentGame: null,
  currentJackpot: null,
  loading: false,
  permissions: [],
  jackpot: {
    value: 0,
    next: 0,
    started: 0,
    ended: 0,
    playerId: null,
  },
};

export const reducer = createReducer(
  initialState,
  on(AccountActions.loadAccount, AccountActions.update, state => ({ ...state, loading: true })),
  on(AccountActions.loadAccountSuccess, (state, { account }) => ({
    ...state,
    ...account,
    loading: false,
  })),
  on(AccountActions.loadJackpotSuccess, (state, { jackpot }) => ({ ...state, jackpot })),
  on(AccountActions.loadAccountFailure, AccountActions.loadAccountDestroy, () => initialState),
);
