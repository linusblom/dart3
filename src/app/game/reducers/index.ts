import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '@root/reducers';

import * as fromGame from './game.reducer';

export interface GameState {
  game: fromGame.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    game: fromGame.reducer,
  })(state, action);
}

export const getGameModuleState = createFeatureSelector<State, GameState>('game');

export const getGameState = createSelector(getGameModuleState, state => state.game);

export const getGameStoreState = createSelector(getGameState, state => state.state);

export const getSelectedGameId = createSelector(getGameState, state => state.selectedGameId);

export const {
  selectIds: getGameIds,
  selectEntities: getGameEntities,
  selectAll: getAllGames,
  selectTotal: getTotalGames,
} = fromGame.adapter.getSelectors(getGameState);
