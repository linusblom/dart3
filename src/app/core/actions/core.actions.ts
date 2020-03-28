import { createAction, props } from '@ngrx/store';

import { Modal } from '@core/models';

export const toggleMenu = createAction('[Core] Toggle Menu');
export const showModal = createAction('[Core] Show Modal', props<{ modal: Modal }>());
export const dismissModal = createAction('[Core] Dismiss Modal');
