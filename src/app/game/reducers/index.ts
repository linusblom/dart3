import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '@root/app.reducer';

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

export const getGameState = createFeatureSelector<State, GameState>('game');
export const getGamePlayersState = createSelector(
  getGameState,
  state => state.player,
);
export const getLoadingPlayers = createSelector(
  getGamePlayersState,
  fromPlayer.getLoadingPlayers,
);
export const getLoadingCreatePlayer = createSelector(
  getGamePlayersState,
  fromPlayer.getLoadingCreatePlayers,
);
export const getSelectedPlayerId = createSelector(
  getGamePlayersState,
  fromPlayer.getSelectedPlayerId,
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
  getGameState,
  state => state.currentGame,
);
export const getGame = createSelector(
  getCurrentGame,
  fromCurrentGame.getGame,
);
export const getLoadingGame = createSelector(
  getCurrentGame,
  fromCurrentGame.getLoadingGame,
);
export const getLoadingRounds = createSelector(
  getCurrentGame,
  fromCurrentGame.getLoadingRounds,
);
export const getGamePlayers = createSelector(
  getAllPlayers,
  getGame,
  (players, game) =>
    players
      .filter(player => game.players.includes(player.id))
      .sort((a, b) => game.players.indexOf(a.id) - game.players.indexOf(b.id)),
);

// export const getGameRoundState = createSelector(
//   getGameState,
//   state => state.round,
// );

// export const { selectAll: getAllRounds } = fromRound.adapter.getSelectors(getGameRoundState);
