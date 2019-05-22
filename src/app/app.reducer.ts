import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';

import * as fromAuth from '@auth/reducers/auth.reducer';
import * as fromCore from '@core/reducers/core.reducer';
import * as fromNotification from '@core/reducers/notification.reducer';

export interface State {
  auth: fromAuth.State;
  notification: fromNotification.State;
  core: fromCore.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  notification: fromNotification.reducer,
  core: fromCore.reducer,
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
export const { selectAll: getAllNotifications } = fromNotification.adapter.getSelectors(
  getNotificationState,
);

export const getCoreState = createFeatureSelector<fromCore.State>('core');
export const getMenuOpen = createSelector(
  getCoreState,
  fromCore.getMenuOpen,
);
