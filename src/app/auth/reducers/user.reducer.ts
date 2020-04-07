import { createReducer, on } from '@ngrx/store';
import { User } from 'dart3-sdk';

import { AuthActions, UserActions } from '@auth/actions';

export type State = User;

export const initialState: State = {
  userId: '',
  username: '',
  email: '',
  name: '',
  nickname: '',
  emailVerified: false,
  picture: '',
  createdAt: undefined,
  updatedAt: undefined,
  lastIp: '',
  lastLogin: undefined,
  loginCount: 0,
  userMetaData: {
    currency: '',
  },
  identities: [],
};

export const reducer = createReducer(
  initialState,

  on(UserActions.getSuccess, (state, { user }) => ({ ...state, ...user })),

  on(AuthActions.login, state => ({ ...state, authenticated: true })),

  on(AuthActions.logout, () => initialState),
);
