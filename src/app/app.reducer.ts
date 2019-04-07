import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from '@auth/reducers/auth.reducer';

export interface State {
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
};

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getAuthenticated = createSelector(
  getAuthState,
  fromAuth.getAuthenticated,
);
