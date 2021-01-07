import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { Player } from 'dart3-sdk';

import * as fromUser from '@user/reducers/user.reducer';
import * as fromCore from '@core/reducers/core.reducer';
import * as fromPlayer from '@player/reducers/player.reducer';
import * as fromJackpot from '@jackpot/reducers/jackpot.reducer';
import { StoreState } from '@shared/models';
import { getGameModuleLoading } from '@game/reducers';

export interface State {
  user: fromUser.State;
  core: fromCore.State;
  player: fromPlayer.State;
  jackpot: fromJackpot.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      user: fromUser.reducer,
      core: fromCore.reducer,
      player: fromPlayer.reducer,
      jackpot: fromJackpot.reducer,
    }),
  },
);

export const getUserState = createFeatureSelector<fromUser.State>('user');
export const getUserStoreState = createSelector(getUserState, ({ state }) => state);
export const getUser = createSelector(getUserState, (state) => state);
export const getUserCurrency = createSelector(
  getUserState,
  (state) => state.metaData.currency || '',
);
export const getUserPicture = createSelector(getUserState, (state) => state.picture);
export const getUserMetaData = createSelector(getUserState, (state) => state.metaData);
export const getUserInvoices = createSelector(getUserState, (state) => state.invoices);

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
  getPlayerStoreState,
  getUserStoreState,
  getJackpotStoreState,
  getGameModuleLoading,
  (playerStoreState, userStoreState, jackpotStoreState, gameModuleLoading) =>
    playerStoreState !== StoreState.NONE ||
    userStoreState !== StoreState.NONE ||
    jackpotStoreState !== StoreState.NONE ||
    gameModuleLoading,
);
