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
  fromPlayer.selectAll,
);

export const getLoadingPlayers = createSelector(
  getGamePlayersState,
  fromPlayer.getLoadingPlayers,
);

export const getLoadingCreatePlayer = createSelector(
  getGamePlayersState,
  fromPlayer.getLoadingCreatePlayers,
);
