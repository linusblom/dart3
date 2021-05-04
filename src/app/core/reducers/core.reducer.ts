import { createReducer, on } from '@ngrx/store';

import { CoreActions } from '@core/actions';
import { Banner, Modal, Verify } from '@core/models';
import { StoreState } from '@shared/models';

export interface State {
  menu: boolean;
  footer: boolean;
  banner: Banner;
  modal: Modal;
  pin: string;
  verify: Verify;
  state: StoreState;
}

export const initialState: State = {
  menu: true,
  footer: true,
  modal: undefined,
  banner: undefined,
  pin: undefined,
  verify: undefined,
  state: StoreState.NONE,
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

  on(CoreActions.getVerifyEmailRequest, CoreActions.verifyEmailRequest, (state) => ({
    ...state,
    state: StoreState.FETCHING,
  })),

  on(CoreActions.getVerifyEmailSuccess, (state, { verify }) => ({
    ...state,
    verify,
    state: StoreState.NONE,
  })),

  on(CoreActions.verifyEmailSuccess, (state) => ({
    ...state,
    verify: {
      ...state.verify,
      verified: true,
    },
    state: StoreState.NONE,
  })),

  on(CoreActions.getVerifyEmailFailure, CoreActions.verifyEmailFailure, (state) => ({
    ...state,
    state: StoreState.NONE,
  })),
);
