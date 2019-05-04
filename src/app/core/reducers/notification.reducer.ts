import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { NotificationActions } from '@core/actions';
import { Notification } from '@core/models';

export interface State extends EntityState<Notification> {}

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>({
  selectId: (notification: Notification) => notification.id,
  sortComparer: false,
});

export const initialState = adapter.getInitialState({});

export const reducer = createReducer(
  initialState,
  on(NotificationActions.pushSuccess, (state, { notification }) =>
    adapter.addOne(notification, state),
  ),
  on(NotificationActions.dismiss, (state, { id }) => adapter.removeOne(id, state)),
);

export const selectAll = adapter.getSelectors().selectAll;
