import { createReducer, on } from '@ngrx/store';
import { User } from 'dart3-sdk';

import { AuthActions } from '@auth/actions';
import { UserActions } from '@user/actions';
import { StoreState } from '@shared/models';

export interface State extends User {
  state: StoreState;
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
  userMetadata: {
    currency: '',
  },
  identities: [],
  bank: {
    players: '0.00',
    turnOver: '0.00',
    inPlay: '0.00',
  },
  state: StoreState.NONE,
};

export const reducer = createReducer(
  initialState,

  on(UserActions.getRequest, state => ({ ...state, state: StoreState.FETCHING })),

  on(UserActions.updateRequest, state => ({ ...state, state: StoreState.UPDATING })),

  on(UserActions.getSuccess, UserActions.updateSuccess, (state, { user }) => ({
    ...state,
    ...user,
    state: StoreState.NONE,
  })),

  on(UserActions.getFailure, UserActions.updateFailure, state => ({
    ...state,
    state: StoreState.NONE,
  })),

  on(AuthActions.logout, () => initialState),
);