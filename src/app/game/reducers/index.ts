import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '@root/reducers';

import * as fromCurrentGame from './game.reducer';
import * as fromPlayer from './player.reducer';

export interface GameState {
  currentGame: fromCurrentGame.State;
  player: fromPlayer.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    currentGame: fromCurrentGame.reducer,
    player: fromPlayer.reducer,
  })(state, action);
}

export const getGameModuleState = createFeatureSelector<State, GameState>('game');
export const getGamePlayersState = createSelector(
  getGameModuleState,
  state => state.player,
);
export const getLoadingPlayers = createSelector(
  getGamePlayersState,
  state => state.loadingPlayers,
);
export const getLoadingCreatePlayer = createSelector(
  getGamePlayersState,
  state => state.loadingCreatePlayer,
);
export const getSelectedPlayerId = createSelector(
  getGamePlayersState,
  state => state.selectedPlayerId,
);
export const {
  selectIds: getPlayerIds,
  selectEntities: getPlayerEntities,
  selectAll: getAllPlayers,
  selectTotal: getTotalPlayers,
} = fromPlayer.adapter.getSelectors(getGamePlayersState);
export const getSelectedPlayer = createSelector(
  getPlayerEntities,
  getSelectedPlayerId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  },
);

export const getCurrentGame = createSelector(
  getGameModuleState,
  state => state.currentGame,
);
export const getGame = createSelector(
  getCurrentGame,
  state => state,
);
export const getLoadingGame = createSelector(
  getCurrentGame,
  state => state.loadingGame,
);
export const getLoadingGamePlayers = createSelector(
  getCurrentGame,
  state => state.loadingPlayers,
);
export const getPlayingJackpot = createSelector(
  getCurrentGame,
  state => state.playingJackpot,
);
export const getTurnText = createSelector(
  getCurrentGame,
  state => state.turnText,
);
export const getGamePlayers = createSelector(
  getAllPlayers,
  getGame,
  (players, { playerIds }) =>
    players
      .filter(player => playerIds.includes(player.id))
      .sort((a, b) => playerIds.indexOf(a.id) - playerIds.indexOf(b.id)),
);
export const getGameJackpotRound = createSelector(
  getCurrentGame,
  state => state.jackpotRound,
);
