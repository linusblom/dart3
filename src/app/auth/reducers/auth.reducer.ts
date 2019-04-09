import { AuthActionsUnion, logout } from '@auth/actions/auth.actions';

export interface State {
  authenticated: boolean;
}

export const initalState: State = {
  authenticated: false,
};

export function reducer(state = initalState, action: AuthActionsUnion): State {
  switch (action.type) {
    case logout.type:
      return {
        ...state,
        authenticated: false,
      };

    default:
      return state;
  }
}

export const getAuthenticated = (state: State) => state.authenticated;
