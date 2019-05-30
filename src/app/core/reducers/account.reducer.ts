import { createReducer, on } from '@ngrx/store';

import { AccountActions } from '@core/actions';
import { Account } from '@core/models';

export const initalState: Account = {
  created: 0,
  jackpot: 0,
  hiddenJackpot: 0,
  currentGame: null,
};

export const reducer = createReducer(
  initalState,
  on(AccountActions.loadAccountSuccess, (state, { account }) => ({ ...state, ...account })),
);

export const getAccount = (account: Account) => account;
