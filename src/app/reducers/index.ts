import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { Player } from 'dart3-sdk';

import * as fromAuth from '@auth/reducers/auth.reducer';
import * as fromUser from '@user/reducers/user.reducer';
import * as fromCore from '@core/reducers/core.reducer';
import * as fromPlayer from '@player/reducers/player.reducer';
import * as fromJackpot from '@jackpot/reducers/jackpot.reducer';
import { StoreState } from '@shared/models';
import { getGameModuleLoading } from '@game/reducers';

export interface State {
  auth: fromAuth.State;
  user: fromUser.State;
  core: fromCore.State;
  player: fromPlayer.State;
  jackpot: fromJackpot.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      auth: fromAuth.reducer,
      user: fromUser.reducer,
      core: fromCore.reducer,
      player: fromPlayer.reducer,
      jackpot: fromJackpot.reducer,
    }),
  },
);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const isAuthenticated = createSelector(getAuthState, (state) => state.authenticated);

export const getUserState = createFeatureSelector<fromUser.State>('user');
export const getUserStoreState = createSelector(getUserState, ({ state }) => state);
export const getUser = createSelector(getUserState, (state) => state);
export const getUserCurrency = createSelector(
  getUserState,
  (state) => state.userMetadata.currency || '',
);
export const getUserPicture = createSelector(getUserState, (state) => state.picture);
export const getUserMetaData = createSelector(getUserState, (state) => state.userMetadata);

export const getCoreState = createFeatureSelector<fromCore.State>('core');
export const showMenu = createSelector(getCoreState, (state) => state.menu);
export const showFooter = createSelector(getCoreState, (state) => state.footer);
export const showModal = createSelector(getCoreState, (state) => !!state.modal);
export const getModal = createSelector(getCoreState, (state) => state.modal);
export const getPin = createSelector(getCoreState, (state) => state.pin);
export const showBanner = createSelector(getCoreState, (state) => !!state.banner);
export const getBanner = createSelector(getCoreState, (state) => state.banner);

export const getPlayerState = createFeatureSelector<fromPlayer.State>('player');
export const getPlayerStoreState = createSelector(getPlayerState, ({ state }) => state);
export const getAllPlayers = createSelector(getPlayerState, fromPlayer.selectAll);
export const getSelectedPlayer = createSelector(
  getPlayerState,
  (state) => state.entities[state.selectedUid] || ({} as Player),
);
export const getSelectedPlayerUid = createSelector(getPlayerState, (state) => state.selectedUid);

export const getJackpotState = createFeatureSelector<fromJackpot.State>('jackpot');
export const getJackpotStoreState = createSelector(getJackpotState, ({ state }) => state);
export const getJackpot = createSelector(getJackpotState, ({ id, value, nextValue }) => ({
  id,
  value,
  nextValue,
}));
export const getJackpotValue = createSelector(getJackpotState, (state) => state.value);
export const getJackpotGems = createSelector(getJackpotState, (state) => state.gems);

export const showLoading = createSelector(
  isAuthenticated,
  getPlayerStoreState,
  getUserStoreState,
  getJackpotStoreState,
  getGameModuleLoading,
  (authenticated, playerStoreState, userStoreState, jackpotStoreState, gameModuleLoading) =>
    !authenticated ||
    playerStoreState !== StoreState.NONE ||
    userStoreState !== StoreState.NONE ||
    jackpotStoreState !== StoreState.NONE ||
    gameModuleLoading,
);
