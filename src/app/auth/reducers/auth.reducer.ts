import { AuthActions, AuthActionTypes } from '@auth/actions/auth.actions';

export interface State {
  authenticated: boolean;
}

export const initalState: State = {
  authenticated: false,
};

export function reducer(state = initalState, { type, payload }: AuthActions): State {
  switch (type) {
    case AuthActionTypes.Logout:
      return {
        ...state,
        authenticated: false,
      };

    default:
      return state;
  }
}

export const getAuthenticated = (state: State) => state.authenticated;
