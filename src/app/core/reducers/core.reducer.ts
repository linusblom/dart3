import { createReducer, on } from '@ngrx/store';

import { CoreActions } from '@core/actions';

export interface State {
  menu: boolean;
}

export const initialState: State = {
  menu: false,
};

export const reducer = createReducer(
  initialState,
  on(CoreActions.toggleMenu, state => ({ ...state, menu: !state.menu })),
);
