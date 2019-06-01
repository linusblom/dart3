import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '@root/app.reducer';

import * as fromGame from './game.reducer';
import * as fromPlayer from './player.reducer';
import * as fromTransaction from './transaction.reducer';

export interface GameState {
  currentGame: fromGame.State;
  player: fromPlayer.State;
  transaction: fromTransaction.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    currentGame: fromGame.reducer,
    player: fromPlayer.reducer,
    transaction: fromTransaction.reducer,
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

export const getGameTransactionState = createSelector(
  getGameState,
  state => state.transaction,
);
export const getLoadingTransactons = createSelector(
  getGameTransactionState,
  fromTransaction.getLoading,
);
export const { selectAll: getAllTransactions } = fromTransaction.adapter.getSelectors(
  getGameTransactionState,
);

export const getGameGameState = createSelector(
  getGameState,
  state => state.currentGame,
);
export const getGame = createSelector(
  getGameGameState,
  fromGame.getGame,
);
export const getLoadingGame = createSelector(
  getGameGameState,
  fromGame.getLoadingGame,
);
