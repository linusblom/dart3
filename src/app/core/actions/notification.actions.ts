import { createAction, props } from '@ngrx/store';

import { Notification, Status } from '@core/models';

export const push = createAction(
  '[Notification] Push',
  props<{ status: Status; message: string }>(),
);
export const dismiss = createAction('[Notification] Dismiss', props<{ id: string }>());
