import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

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
  fromAuth.getLoading,
);
export const getAuthUser = createSelector(
  getAuthState,
  fromAuth.getUser,
);

export const getNotificationState = createFeatureSelector<fromNotification.State>('notification');
export const getNotifications = createSelector(
  getNotificationState,
  fromNotification.getNotifications,
);
