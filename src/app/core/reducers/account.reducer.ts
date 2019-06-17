import { createReducer, on } from '@ngrx/store';

import { AccountActions } from '@core/actions';
import { Account } from '@core/models';

export interface State extends Account {
  loading: boolean;
}

export const initalState: State = {
  created: 0,
  jackpot: 0,
  hiddenJackpot: 0,
  currentGame: null,
  allowedBets: [],
  allowedGames: [],
  loading: false,
};

export const reducer = createReducer(
  initalState,
  on(AccountActions.loadAccount, state => ({ ...state, loading: true })),
  on(AccountActions.loadAccountSuccess, (state, { account }) => ({
    ...state,
    ...account,
    loading: false,
  })),
  on(AccountActions.loadAccountFailure, AccountActions.loadAccountDestroy, () => initalState),
);

export const getAccount = (state: State) => state;
export const getLoadingAccount = (state: State) => state.loading;