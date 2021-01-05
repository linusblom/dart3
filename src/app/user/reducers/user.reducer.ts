import { createReducer, on } from '@ngrx/store';
import { User, Invoice } from 'dart3-sdk';

import { UserActions, InvoiceActions } from '@user/actions';
import { StoreState } from '@shared/models';

export interface State extends User {
  state: StoreState;
  invoices: Invoice[];
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
  metaData: {
    currency: '',
    rake: 0,
    jackpotFee: 0,
    nextJackpotFee: 0,
    gemChance: 0,
  },
  identities: [],
  bank: {
    players: '0.00',
    turnOver: '0.00',
    inPlay: '0.00',
    rake: '0.00',
  },
  state: StoreState.NONE,
  invoices: [],
};

export const reducer = createReducer(
  initialState,

  on(UserActions.getRequest, InvoiceActions.getRequest, (state) => ({
    ...state,
    state: StoreState.FETCHING,
  })),

  on(UserActions.updateRequest, (state) => ({ ...state, state: StoreState.UPDATING })),

  on(UserActions.getSuccess, UserActions.updateRequest, (state, { user }) => ({
    ...state,
    ...user,
    metaData: {
      ...state.metaData,
      ...user.metaData,
    },
    state: StoreState.NONE,
  })),

  on(InvoiceActions.getSuccess, (state, { invoices }) => ({
    ...state,
    invoices,
    state: StoreState.NONE,
  })),

  on(UserActions.getFailure, UserActions.updateFailure, InvoiceActions.getFailure, (state) => ({
    ...state,
    state: StoreState.NONE,
  })),
);
