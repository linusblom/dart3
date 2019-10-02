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
