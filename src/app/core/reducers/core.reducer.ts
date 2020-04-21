import { createReducer, on } from '@ngrx/store';

import { CoreActions } from '@core/actions';
import { Modal } from '@core/models';

export interface State {
  menu: boolean;
  modal: Modal;
  pin: string;
}

export const initialState: State = {
  menu: false,
  modal: undefined,
  pin: undefined,
};

export const reducer = createReducer(
  initialState,
  on(CoreActions.toggleMenu, (state, { menu }) => ({ ...state, menu })),

  on(CoreActions.showModal, (state, { modal }) => ({ ...state, modal })),

  on(CoreActions.dismissModal, state => ({ ...state, modal: undefined })),

  on(CoreActions.confirmPinDispatch, (state, { pin }) => ({ ...state, pin })),

  on(CoreActions.confirmPinComplete, state => ({ ...state, pin: undefined })),
);
