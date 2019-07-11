import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAccount from '@core/reducers/account.reducer';
import * as fromAuth from '@core/reducers/auth.reducer';
import * as fromCore from '@core/reducers/core.reducer';
import * as fromNotification from '@core/reducers/notification.reducer';

export interface State {
  auth: fromAuth.State;
  notification: fromNotification.State;
  core: fromCore.State;
  account: fromAccount.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      auth: fromAuth.reducer,
      notification: fromNotification.reducer,
      core: fromCore.reducer,
      account: fromAccount.reducer,
    }),
  },
);

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
export const { selectAll: getAllNotifications } = fromNotification.adapter.getSelectors(
  getNotificationState,
);

export const getCoreState = createFeatureSelector<fromCore.State>('core');
export const getMenuOpen = createSelector(
  getCoreState,
  state => state.menuOpen,
);

export const getAccountState = createFeatureSelector<fromAccount.State>('account');
export const getAccount = createSelector(
  getAccountState,
  state => state,
);
export const getLoadingAccount = createSelector(
  getAccountState,
  state => state.loading,
);
export const getPermissions = createSelector(
  getAccountState,
  state => state.permissions,
);
