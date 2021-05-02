import { Banner, Modal, Sound, Verify } from '@core/models';
import { Action, createAction, props } from '@ngrx/store';

export const toggleMenu = createAction('[Core] Toggle Menu', props<{ menu: boolean }>());
export const toggleFooter = createAction('[Core] Toggle Footer', props<{ footer: boolean }>());
export const showModal = createAction('[Core] Show Modal', props<{ modal: Modal }>());
export const dismissModal = createAction('[Core] Dismiss Modal');
export const confirmPin = createAction(
  '[Core] Confirm Pin',
  props<{
    header: string;
    text: string;
    action: Action;
    pinDisabled: boolean;
    admin?: boolean;
    okText?: string;
    okColor?: string;
    cancelAction?: Action;
  }>(),
);
export const confirmPinDispatch = createAction(
  '[Core] Confirm Pin Dispatch',
  props<{ pin: string; action: Action }>(),
);
export const confirmPinComplete = createAction('[Core] Confirm Pin Complete');

export const showBanner = createAction('[Core] Show Banner', props<{ banner: Banner }>());
export const dismissBanner = createAction('[Core] Dismiss Banner');

export const playSound = createAction('[Core] Play Sound', props<{ sound: Sound }>());

export const getVerifyEmailRequest = createAction(
  '[Core] Get Verify Email Request',
  props<{ uid: string; token: string }>(),
);
export const getVerifyEmailSuccess = createAction(
  '[Core] Get Verify Email Success',
  props<{ verify: Verify }>(),
);
export const getVerifyEmailFailure = createAction('[Core] Get Verify Email Failure');

export const verifyEmailRequest = createAction('[Core] Verify Email Request');
export const verifyEmailSuccess = createAction('[Core] Verify Email Success');
export const verifyEmailFailure = createAction('[Core] Verify Email Failure');
