import {
  AuthActionsUnion,
  login,
  loginFailure,
  loginSuccess,
  logout,
  updateProfileSuccess,
} from '@auth/actions/auth.actions';
import { User } from 'firebase';

export interface State {
  loading: boolean;
  user: User;
}

export const initalState: State = {
  loading: false,
  user: null,
};

export function reducer(state = initalState, action: AuthActionsUnion): State {
  switch (action.type) {
    case login.type: {
      return {
        ...state,
        loading: true,
      };
    }

    case loginSuccess.type: {
      return {
        user: action.user,
        loading: false,
      };
    }

    case loginFailure.type: {
      return {
        ...state,
        user: null,
        loading: false,
      };
    }

    case logout.type:
      return {
        ...state,
        user: null,
      };

    case updateProfileSuccess.type:
      return {
        ...state,
        user: {
          ...state.user,
          displayName: action.displayName,
        },
      };

    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getUser = (state: State) => state.user;
