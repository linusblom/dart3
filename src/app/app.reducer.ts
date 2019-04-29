import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';

import * as fromAuth from '@auth/reducers/auth.reducer';
import * as fromNotification from '@core/reducers/notification.reducer';

export interface State {
  auth: fromAuth.State;
  notification: fromNotification.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  notification: fromNotification.reducer,
};

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getAuthLoading = createSelector(
  getAuthState,
  state => state.loading,
);
export const getAuthUser = createSelector(
  getAuthState,
  state => state.user,
);

export const getNotificationState = createFeatureSelector<fromNotification.State>('notification');
export const getNotifications = createSelector(
  getNotificationState,
  state => state.notifications,
);
