import { createReducer, on } from '@ngrx/store';
import { User } from 'firebase';

import { AuthActions } from '@core/actions';

export interface State {
  loading: boolean;
  user: User;
  account: Account;
}

export const initalState: State = {
  loading: false,
  user: null,
  account: null,
};

export const reducer = createReducer(
  initalState,
  on(AuthActions.login, AuthActions.updatePassword, state => ({ ...state, loading: true })),
  on(AuthActions.updatePasswordSuccess, AuthActions.updatePasswordFailure, state => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, loading: false, user })),
  on(AuthActions.loginFailure, AuthActions.logout, () => initalState),
  on(AuthActions.updateProfileSuccess, (state, { displayName }) => ({
    ...state,
    user: { ...state.user, displayName },
  })),
);

export const getLoading = (state: State) => state.loading;
export const getUser = (state: State) => state.user;
