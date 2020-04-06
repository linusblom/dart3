import { createReducer, on } from '@ngrx/store';
import { Account } from 'dart3-sdk';

import { AuthActions, AccountActions } from '@auth/actions';

export interface State extends Account {
  authenticated: boolean;
}

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
    currency: '$',
  },
  identities: [],
  authenticated: false,
};

export const reducer = createReducer(
  initialState,

  on(AccountActions.getSuccess, (state, { account }) => ({ ...state, ...account })),

  on(AuthActions.login, state => ({ ...state, authenticated: true })),

  on(AuthActions.logout, () => initialState),
);
