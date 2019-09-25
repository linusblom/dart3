import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '@root/reducers';

import * as fromCurrentGame from './game.reducer';

export interface GameState {
  currentGame: fromCurrentGame.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    currentGame: fromCurrentGame.reducer,
  })(state, action);
}

export const getGameModuleState = createFeatureSelector<State, GameState>('game');

export const getCurrentGame = createSelector(
  getGameModuleState,
  state => state.currentGame,
);
export const getGame = createSelector(
  getCurrentGame,
  state => state.game,
);
export const getLoadingGame = createSelector(
  getCurrentGame,
  state => state.loadingGame || state.loadingPlayers,
);
export const getLoading = createSelector(
  getLoadingGame,
  fromRoot.getLoadingPlayers,
  fromRoot.getLoadingAccount,
  (game, players, account) => game || players || account,
);
export const getPlayingJackpot = createSelector(
  getCurrentGame,
  state => state.playingJackpot,
);
export const getGameJackpotRound = createSelector(
  getCurrentGame,
  state => state.jackpotRound,
);
export const getBoardData = createSelector(
  getCurrentGame,
  state => state.boardData,
);
export const getGamePlayers = createSelector(
  getGame,
  fromRoot.getAllPlayers,
  ({ playerIds }, players) =>
    players
      .filter(player => playerIds.includes(player.id))
      .sort((a, b) => playerIds.indexOf(a.id) - playerIds.indexOf(b.id)),
);
