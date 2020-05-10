import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '@root/reducers';

import * as fromGame from './game.reducer';
import * as fromWizard from './wizard.reducer';

export interface GameState {
  game: fromGame.State;
  wizard: fromWizard.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    game: fromGame.reducer,
    wizard: fromWizard.reducer,
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
export const getSelectedGame = createSelector(
  getGameState,
  state => state.entities[state.selectedGameId],
);

export const getWizardState = createSelector(getGameModuleState, state => state.wizard);
export const getWizardStep = createSelector(getWizardState, state => state.step);
export const getWizardValues = createSelector(
  getWizardState,
  ({ type, variant, bet, sets, legs }) => ({
    type,
    variant,
    bet,
    sets,
    legs,
  }),
);
export const getWizardPlayers = createSelector(getWizardState, state => state.players);
