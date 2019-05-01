import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '@root/app.reducer';

import * as fromPlayer from './player.reducer';

export interface GameState {
  player: fromPlayer.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    player: fromPlayer.reducer,
  })(state, action);
}

export const getGameState = createFeatureSelector<State, GameState>('game');

export const getGamePlayersState = createSelector(
  getGameState,
  state => state.player,
);

export const getPlayers = createSelector(
  getGamePlayersState,
  state => state.players,
);

export const getLoadingPlayers = createSelector(
  getGamePlayersState,
  state => state.loadingPlayers,
);

export const getLoadingCreatePlayer = createSelector(
  getGamePlayersState,
  state => state.loadingCreatePlayer,
);
