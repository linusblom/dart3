import { createAction, props, union } from '@ngrx/store';

import { NotificationState } from '@core/models';

export const push = createAction(
  '[Notification] Add',
  props<{ state: NotificationState; message: string }>(),
);
export const dismiss = createAction('[Notification] Dismiss', props<{ id: string }>());

const actions = union({ push, dismiss });
export type NotificationActionsUnion = typeof actions;
