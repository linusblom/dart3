import { createAction, props, Action } from '@ngrx/store';

import { Modal } from '@core/models';

export const toggleMenu = createAction('[Core] Toggle Menu');
export const showModal = createAction('[Core] Show Modal', props<{ modal: Modal }>());
export const dismissModal = createAction('[Core] Dismiss Modal');
export const confirmPin = createAction(
  '[Core] Confirm Pin',
  props<{ header: string; text: string; action: Action; okText?: string; okColor?: string }>(),
);
export const confirmPinDispatch = createAction(
  '[Core] Confirm Pin Dispatch',
  props<{ pin: string; action: Action }>(),
);
export const confirmPinComplete = createAction('[Core] Confirm Pin Complete');
