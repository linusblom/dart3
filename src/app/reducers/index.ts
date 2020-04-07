import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { Player } from 'dart3-sdk';

import * as fromUser from '@auth/reducers/user.reducer';
import * as fromCore from '@core/reducers/core.reducer';
import * as fromPlayer from '@player/reducers/player.reducer';
import { StoreState } from '@shared/models';

export interface State {
  user: fromUser.State;
  core: fromCore.State;
  player: fromPlayer.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      user: fromUser.reducer,
      core: fromCore.reducer,
      player: fromPlayer.reducer,
    }),
  },
);

export const getUserState = createFeatureSelector<fromUser.State>('user');
export const isAuthenticated = createSelector(getUserState, state => !!state.userId);
export const getAccount = createSelector(getUserState, state => state);
export const getUserCurrency = createSelector(
  getUserState,
  state => state.userMetaData.currency || 'Ð',
);

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
