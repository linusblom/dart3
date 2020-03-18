import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from '@auth/reducers/auth.reducer';
import * as fromCore from '@core/reducers/core.reducer';

export interface State {
  auth: fromAuth.State;
  core: fromCore.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      auth: fromAuth.reducer,
      core: fromCore.reducer,
    }),
  },
);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const isAuthenticated = createSelector(getAuthState, state => state.authenticated);
export const getUser = createSelector(getAuthState, state => state.user);

export const getCoreState = createFeatureSelector<fromCore.State>('core');
export const showMenu = createSelector(getCoreState, state => state.menu);

export const showLoading = createSelector(isAuthenticated, authenticated => !authenticated);
