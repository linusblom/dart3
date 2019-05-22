import { createReducer, on } from '@ngrx/store';

import { CoreActions } from '@core/actions';

export interface State {
  menuOpen: boolean;
}

export const initalState: State = {
  menuOpen: false,
};

export const reducer = createReducer(
  initalState,
  on(CoreActions.openMenu, state => ({ ...state, menuOpen: true })),
  on(CoreActions.closeMenu, state => ({ ...state, menuOpen: false })),
);

export const getMenuOpen = (state: State) => state.menuOpen;
