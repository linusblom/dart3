import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { Player } from 'dart3-sdk';

import * as fromAuth from '@auth/reducers/auth.reducer';
import * as fromUser from '@user/reducers/user.reducer';
import * as fromCore from '@core/reducers/core.reducer';
import * as fromPlayer from '@player/reducers/player.reducer';
import { StoreState } from '@shared/models';

export interface State {
  auth: fromAuth.State;
  user: fromUser.State;
  core: fromCore.State;
  player: fromPlayer.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      auth: fromAuth.reducer,
      user: fromUser.reducer,
      core: fromCore.reducer,
      player: fromPlayer.reducer,
    }),
  },
);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const isAuthenticated = createSelector(getAuthState, state => state.authenticated);

export const getUserState = createFeatureSelector<fromUser.State>('user');
export const getUser = createSelector(getUserState, state => state);
export const getUserCurrency = createSelector(
  getUserState,
  state => state.userMetadata.currency || 'Ð',
);
export const getUserPicture = createSelector(getUserState, state => state.picture);

export const getCoreState = createFeatureSelector<fromCore.State>('core');
export const showMenu = createSelector(getCoreState, state => state.menu);
export const showModal = createSelector(getCoreState, state => !!state.modal);
export const getModal = createSelector(getCoreState, state => state.modal);

export const getPlayerState = createFeatureSelector<fromPlayer.State>('player');
export const getPlayerStoreState = createSelector(getPlayerState, ({ state }) => state);
export const getAllPlayers = createSelector(getPlayerState, fromPlayer.selectAll);
export const getSelectedPlayer = createSelector(
  getPlayerState,
  state => state.entities[state.selectedId] || ({} as Player),
);
export const getSelectedPlayerId = createSelector(getPlayerState, state => state.selectedId);

export const showLoading = createSelector(
  isAuthenticated,
  getPlayerStoreState,
  (authenticated, playerStoreState) => !authenticated || playerStoreState !== StoreState.NONE,
);
