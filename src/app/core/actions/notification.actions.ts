import { createAction, props } from '@ngrx/store';

import { Notification, Status } from '@core/models';

export const push = createAction(
  '[Notification] Push',
  props<{ status: Status; message: string }>(),
);
export const pushSuccess = createAction(
  '[Notification] Push Success',
  props<{ notification: Notification }>(),
);
export const dismiss = createAction('[Notification] Dismiss', props<{ id: string }>());
