import { createReducer, on } from '@ngrx/store';
import { Account } from 'dart3-sdk';

import { AccountActions } from '@core/actions';

export interface State extends Account {
  loading: boolean;
}

export const initialState: State = {
  created: 0,
  currentGame: null,
  currentJackpot: null,
  loading: false,
  permissions: [],
  currency: 'Ð',
};

export const reducer = createReducer(
  initialState,
  on(AccountActions.valueChangesInit, AccountActions.update, state => ({
    ...state,
    loading: true,
  })),
  on(AccountActions.valueChangesSuccess, (state, { account }) => ({
    ...state,
    ...account,
    loading: false,
  })),
  on(AccountActions.valueChangesFailure, AccountActions.valueChangesDestroy, () => initialState),
);
