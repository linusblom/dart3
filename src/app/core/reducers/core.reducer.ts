import { createReducer, on } from '@ngrx/store';

import { CoreActions } from '@core/actions';
import { Modal, Banner } from '@core/models';

export interface State {
  menu: boolean;
  footer: boolean;
  banner: Banner;
  modal: Modal;
  pin: string;
}

export const initialState: State = {
  menu: false,
  footer: false,
  modal: undefined,
  banner: undefined,
  pin: undefined,
};

export const reducer = createReducer(
  initialState,
  on(CoreActions.toggleMenu, (state, { menu }) => ({ ...state, menu })),

  on(CoreActions.toggleFooter, (state, { footer }) => ({ ...state, footer })),

  on(CoreActions.showModal, (state, { modal }) => ({ ...state, modal })),

  on(CoreActions.dismissModal, (state) => ({ ...state, modal: undefined })),

  on(CoreActions.confirmPinDispatch, (state, { pin }) => ({ ...state, pin })),

  on(CoreActions.confirmPinComplete, (state) => ({ ...state, pin: undefined })),

  on(CoreActions.showBanner, (state, { banner }) => ({ ...state, banner })),

  on(CoreActions.dismissBanner, (state) => ({ ...state, banner: undefined })),
);
