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

  on(AuthActions.login, () => ({ authenticated: true })),

  on(AuthActions.logout, () => initialState),
);
