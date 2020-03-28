import { createReducer, on } from '@ngrx/store';

import { CoreActions } from '@core/actions';
import { Modal } from '@core/models';

export interface State {
  menu: boolean;
  modal: Modal;
}

export const initialState: State = {
  menu: false,
  modal: undefined,
};

export const reducer = createReducer(
  initialState,
  on(CoreActions.toggleMenu, state => ({ ...state, menu: !state.menu })),

  on(CoreActions.showModal, (state, { modal }) => ({ ...state, modal })),

  on(CoreActions.dismissModal, state => ({ ...state, modal: undefined })),
);
