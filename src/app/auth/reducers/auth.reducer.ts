import { createReducer, on } from '@ngrx/store';

import { AuthActions } from '@auth/actions';
import { User } from '@auth/models';

export interface State {
  user: User;
  authenticated: boolean;
}

export const initialState: State = {
  user: {} as User,
  authenticated: false,
};

export const reducer = createReducer(
  initialState,

  on(AuthActions.loginComplete, (state, { user }) => ({ ...state, user, authenticated: true })),

  on(AuthActions.logout, state => ({ ...state, user: {} as User, authenticated: false })),
);
