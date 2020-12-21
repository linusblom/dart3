import { createReducer, on } from '@ngrx/store';

import { AuthActions } from '@auth/actions';

export interface State {
  authenticated: boolean;
}

export const initialState: State = {
  authenticated: false,
};

export const reducer = createReducer(
  initialState,

  on(AuthActions.loginSuccess, (state) => ({ ...state, authenticated: true })),

  on(AuthActions.loginFailure, (state) => ({ ...state, authenticated: false })),

  on(AuthActions.setAuthenticated, (state, { authenticated }) => ({ ...state, authenticated })),
);
