import { createAction, props } from '@ngrx/store';

import { Status } from '@core/models/notification';

export const push = createAction(
  '[Notification] Push',
  props<{ status: Status; message: string }>(),
);
export const dismiss = createAction('[Notification] Dismiss', props<{ id: string }>());
