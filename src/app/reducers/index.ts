import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { Permission } from '@core/models';
import * as fromAccount from '@core/reducers/account.reducer';
import * as fromAuth from '@core/reducers/auth.reducer';
import * as fromCore from '@core/reducers/core.reducer';
import * as fromJackpot from '@core/reducers/jackpot.reducer';
import * as fromNotification from '@core/reducers/notification.reducer';
import * as fromPlayer from '@player/reducers/player.reducer';

export interface State {
  auth: fromAuth.State;
  notification: fromNotification.State;
  core: fromCore.State;
  account: fromAccount.State;
  player: fromPlayer.State;
  jackpot: fromJackpot.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      auth: fromAuth.reducer,
      notification: fromNotification.reducer,
      core: fromCore.reducer,
      account: fromAccount.reducer,
      player: fromPlayer.reducer,
      jackpot: fromJackpot.reducer,
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

export const getJackpotState = createFeatureSelector<fromJackpot.State>('jackpot');
export const getJackpot = createSelector(
  getJackpotState,
  state => state,
);
export const getJackpotValue = createSelector(
  getJackpotState,
  state => state.value,
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
export const getAccountCurrency = createSelector(
  getAccountState,
  state => state.currency,
);
export const getPermissions = createSelector(
  getAccountState,
  state => state.permissions,
);
export const hasPermission = (permission: Permission) =>
  createSelector(
    getAccountState,
    state => state.permissions.includes(permission),
  );

export const getPlayerState = createFeatureSelector<fromPlayer.State>('player');
export const getLoadingPlayers = createSelector(
  getPlayerState,
  state => state.loadingPlayers,
);
export const getLoadingCreatePlayer = createSelector(
  getPlayerState,
  state => state.loadingCreatePlayer,
);
export const getSelectedPlayerId = createSelector(
  getPlayerState,
  state => state.selectedPlayerId,
);
export const {
  selectIds: getPlayerIds,
  selectEntities: getPlayerEntities,
  selectAll: getAllPlayers,
  selectTotal: getTotalPlayers,
} = fromPlayer.adapter.getSelectors(getPlayerState);
export const getSelectedPlayer = createSelector(
  getPlayerEntities,
  getSelectedPlayerId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  },
);
export const getPlayersByIds = (ids: string[]) =>
  createSelector(
    getAllPlayers,
    players => players.filter(player => ids.includes(player.id)),
  );
