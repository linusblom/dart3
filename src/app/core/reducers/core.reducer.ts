import { createReducer, on } from '@ngrx/store';

import { CoreActions } from '@core/actions';

export interface State {
  menuOpen: boolean;
}

export const initialState: State = {
  menuOpen: false,
};

export const reducer = createReducer(
  initialState,
  on(CoreActions.openMenu, state => ({ ...state, menuOpen: true })),
  on(CoreActions.closeMenu, state => ({ ...state, menuOpen: false })),
);
