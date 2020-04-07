import { createReducer, on } from '@ngrx/store';
import { User } from 'dart3-sdk';

import { AuthActions } from '@auth/actions';
import { UserActions } from '@user/actions';

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
  userMetadata: {
    currency: '',
  },
  identities: [],
};

export const reducer = createReducer(
  initialState,

  on(UserActions.getSuccess, UserActions.updateSuccess, (state, { user }) => ({
    ...state,
    ...user,
  })),

  on(AuthActions.logout, () => initialState),
);
