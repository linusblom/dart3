import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '@root/reducers';

import { createGame } from '@game/models';
import { StoreState } from '@shared/models';

import * as fromCurrentGame from './current-game.reducer';
import * as fromGame from './game.reducer';

export interface GameState {
  game: fromGame.State;
  currentGame: fromCurrentGame.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    game: fromGame.reducer,
    currentGame: fromCurrentGame.reducer,
  })(state, action);
}

export const getGameModuleState = createFeatureSelector<State, GameState>('game');

export const getGameState = createSelector(
  getGameModuleState,
  state => state.game,
);

export const getGameStoreState = createSelector(
  getGameState,
  state => state.state,
);

export const getSelectedGameId = createSelector(
  getGameState,
  state => state.selectedGameId,
);

export const {
  selectIds: getGameIds,
  selectEntities: getGameEntities,
  selectAll: getAllGames,
  selectTotal: getTotalGames,
} = fromGame.adapter.getSelectors(getGameState);

export const getSelectedGame = createSelector(
  getGameEntities,
  getSelectedGameId,
  (entities, selectedId) => {
    return (selectedId && entities[selectedId]) || createGame();
  },
);

export const getCurrentGameState = createSelector(
  getGameModuleState,
  state => state.currentGame,
);

export const getCurrentGame = createSelector(
  getCurrentGameState,
  state => state.game,
);

export const getCurrentGameLoading = createSelector(
  getCurrentGameState,
  state => state.loadingGame || state.loadingPlayers,
);

export const getLoading = createSelector(
  getGameStoreState,
  getCurrentGameLoading,
  fromRoot.getLoadingPlayers,
  fromRoot.getLoadingAccount,
  (state, currentGame, players, account) =>
    state !== StoreState.NONE || currentGame || players || account,
);

export const getPlayingJackpot = createSelector(
  getCurrentGameState,
  state => state.playingJackpot,
);

export const getGameJackpotRound = createSelector(
  getCurrentGameState,
  state => state.jackpotRound,
);
