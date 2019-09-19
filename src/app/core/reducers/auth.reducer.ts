import { createReducer, on } from '@ngrx/store';
import { User } from 'firebase';

import { AuthActions } from '@core/actions';

export interface State {
  loading: boolean;
  user: User;
}

export const initialState: State = {
  loading: false,
  user: null,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.updatePassword, state => ({ ...state, loading: true })),
  on(AuthActions.updatePasswordSuccess, AuthActions.updatePasswordFailure, state => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, loading: false, user })),
  on(AuthActions.loginFailure, AuthActions.logout, () => initialState),
  on(AuthActions.updateProfileSuccess, (state, { displayName }) => ({
    ...state,
    user: { ...state.user, displayName },
  })),
);
