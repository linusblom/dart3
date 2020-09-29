import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '@root/reducers';
import { StoreState } from '@shared/models';

import * as fromGame from './game.reducer';
import * as fromWizard from './wizard.reducer';
import * as fromMatch from './match.reducer';
import * as fromTeam from './team.reducer';
import * as fromHit from './hit.reducer';
import { defaultSettings } from './wizard.reducer';
import { MatchStatus } from 'dart3-sdk';

export interface GameState {
  game: fromGame.State;
  wizard: fromWizard.State;
  match: fromMatch.State;
  team: fromTeam.State;
  hit: fromHit.State;
}

export interface State extends fromRoot.State {
  game: GameState;
}

export function reducers(state: GameState | undefined, action: Action) {
  return combineReducers({
    game: fromGame.reducer,
    wizard: fromWizard.reducer,
    match: fromMatch.reducer,
    team: fromTeam.reducer,
    hit: fromHit.reducer,
  })(state, action);
}

export const getGameModuleState = createFeatureSelector<State, GameState>('game');
export const getGameModuleLoading = createSelector(
  getGameModuleState,
  (state) =>
    state && (state.game.state !== StoreState.NONE || state.match.state !== StoreState.NONE),
);

export const getGameState = createSelector(getGameModuleState, (state) => state.game);
export const getGameStoreState = createSelector(getGameState, (state) => state.state);
export const getSelectedGameId = createSelector(getGameState, (state) => state.selectedId);
export const { selectAll: getAllGames } = fromGame.adapter.getSelectors(getGameState);
export const getSelectedGame = createSelector(
  getGameState,
  (state) => state.entities[state.selectedId],
);

export const getWizardState = createSelector(getGameModuleState, (state) => state.wizard);
export const getWizardStep = createSelector(getWizardState, (state) => state.step);
export const getWizardValues = createSelector(getWizardState, (state) => ({
  type: state.type,
  ...(state.type ? state[state.type] : defaultSettings),
}));
export const getWizardPlayers = createSelector(getWizardState, (state) => state.players);

export const getMatchState = createSelector(getGameModuleState, (state) => state.match);
export const { selectAll: getAllMatches } = fromMatch.adapter.getSelectors(getMatchState);
export const getSelectedMatchId = createSelector(getMatchState, (state) => state.selectedId);
export const getSelectedMatch = createSelector(
  getMatchState,
  (state) => state.entities[state.selectedId],
);
export const getGameMatches = createSelector(
  getAllMatches,
  getSelectedGameId,
  (matches, selectedGameId) => matches.filter(({ gameId }) => gameId === selectedGameId),
);

export const getHitState = createSelector(getGameModuleState, (state) => state.hit);
export const { selectAll: getAllHits } = fromHit.adapter.getSelectors(getHitState);

export const getTeamState = createSelector(getGameModuleState, (state) => state.team);
export const { selectAll: getAllTeams } = fromTeam.adapter.getSelectors(getTeamState);
export const getSelectedMatchTeams = createSelector(
  getSelectedMatchId,
  getAllTeams,
  getAllHits,
  (selectedMatchId, teams, hits) =>
    teams
      .filter(({ matchId }) => matchId === selectedMatchId)
      .map((team) => ({
        ...team,
        hits: hits.filter(({ matchTeamId }) => team.id === matchTeamId),
      })),
);

export const getRoundDetails = createSelector(
  getSelectedGame,
  getSelectedMatch,
  getSelectedMatchTeams,
  (game, match, teams) => {
    if (!game || !match || !teams || match.status !== MatchStatus.Playing) {
      return {
        gameType: undefined,
        round: 0,
        tieBreak: false,
        currentTotal: 0,
        previousScore: 0,
        highestScore: 0,
      };
    }

    const currentTeam = teams.find((team) => team.id === match.activeMatchTeamId);
    const previousTeam = teams.find(
      (team) => team.order === (currentTeam.order > 1 ? currentTeam.order - 1 : teams.length),
    );

    const previousScore = (previousTeam.hits[previousTeam.hits.length - 1] || { score: 0 }).score;

    // let previousScore = 0;

    // if (currentTeamIndex > 0 && (match.activeRound > 1 || teams[currentTeamIndex].order > 0)) {
    //   previousScore = teams[currentTeamIndex - 1].hits.find(
    //     (hit) => hit.round === match.activeRound,
    //   ).score;
    // } else if (currentTeamIndex === 0 && match.activeRound > 1) {
    //   previousScore = teams[teams.length - 1].hits.find(
    //     (hit) => hit.round === match.activeRound - 1,
    //   ).score;
    // }

    const highestScore = teams.reduce((highest, team) => {
      const hit = team.hits.find((hit) => hit.round === match.activeRound);
      return hit && hit.score > highest ? hit.score : highest;
    }, 0);

    return {
      gameType: game.type,
      round: match.activeRound,
      tieBreak: match.activeRound === game.tieBreak,
      currentTotal: currentTeam.score,
      previousScore,
      highestScore,
    };
  },
);
