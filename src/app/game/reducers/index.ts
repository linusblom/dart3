import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '@root/reducers';

import * as fromGame from './game.reducer';
import * as fromWizard from './wizard.reducer';
import * as fromMatch from './match.reducer';
import { StoreState } from '@shared/models';

export interface GameState {
  game: fromGame.State;
  wizard: fromWizard.State;
  match: fromMatch.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    game: fromGame.reducer,
    wizard: fromWizard.reducer,
    match: fromMatch.reducer,
  })(state, action);
}

export const getGameModuleState = createFeatureSelector<State, GameState>('game');
export const getGameModuleLoading = createSelector(
  getGameModuleState,
  state => state && (state.game.state !== StoreState.NONE || state.match.state !== StoreState.NONE),
);

export const getGameState = createSelector(getGameModuleState, state => state.game);
export const getGameStoreState = createSelector(getGameState, state => state.state);
export const getSelectedGameId = createSelector(getGameState, state => state.selectedId);
export const {
  selectIds: getGameIds,
  selectEntities: getGameEntities,
  selectAll: getAllGames,
  selectTotal: getTotalGames,
} = fromGame.adapter.getSelectors(getGameState);
export const getSelectedGame = createSelector(
  getGameState,
  state => state.entities[state.selectedId],
);

export const getWizardState = createSelector(getGameModuleState, state => state.wizard);
export const getWizardStep = createSelector(getWizardState, state => state.step);
export const getWizardValues = createSelector(
  getWizardState,
  ({ type, tournament, team, bet, sets, legs }) => ({
    type,
    tournament,
    team,
    bet,
    sets,
    legs,
  }),
);
export const getWizardPlayers = createSelector(getWizardState, state => state.players);

export const getMatchState = createSelector(getGameModuleState, state => state.match);
export const {
  selectIds: getMatchIds,
  selectEntities: getMatchEntities,
  selectAll: getAllMatches,
  selectTotal: getTotalMatches,
} = fromMatch.adapter.getSelectors(getMatchState);
export const getSelectedMatch = createSelector(
  getMatchState,
  state => state.entities[state.selectedId],
);
export const getGameMatches = createSelector(
  getAllMatches,
  getSelectedGameId,
  (matches, selectedGameId) => matches.filter(({ gameId }) => gameId === selectedGameId),
);
