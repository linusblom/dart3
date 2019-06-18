import { createReducer, on } from '@ngrx/store';

import { GameActions } from '@game/actions';
import { Game, ScoreBoard } from '@game/models';

export interface State extends Game {
  scoreboard: ScoreBoard;
  loadingGame: boolean;
  loadingRounds: boolean;
}

export const initalState: State = {
  type: null,
  bet: 0,
  started: 0,
  ended: 0,
  players: [],
  prizePool: 0,
  currentTurn: 0,
  currentRound: 0,
  rounds: [],
  scoreboard: { roundScores: [], total: {}, roundText: [] },
  loadingGame: false,
  loadingRounds: false,
};

export const reducer = createReducer(
  initalState,
  on(GameActions.updateGame, (state, { data }) => ({ ...state, ...data })),
  on(GameActions.updateGameSuccess, state => ({ ...state, loadingGame: false })),
  on(GameActions.loadGame, state => ({ ...state, loadingGame: true })),
  on(GameActions.loadGameSuccess, (state, { game }) => ({ ...state, ...game, loadingGame: false })),
  on(GameActions.loadGameFailure, state => ({ ...state, loadingGame: false })),
  on(GameActions.endTurn, state => ({ ...state, loadingGame: true })),
  on(GameActions.loadRound, state => ({ ...state, loadingRounds: true })),
  on(GameActions.loadRoundSuccess, (state, { rounds }) => ({
    ...state,
    rounds,
    loadingRounds: false,
  })),
  on(GameActions.loadRoundFailure, state => ({ ...state, loadingRounds: false })),
  on(GameActions.updateScoreBoard, (state, { scoreboard }) => ({ ...state, scoreboard })),
);

export const getGame = (state: State) => state;
export const getLoadingGame = (state: State) => state.loadingGame;
export const getLoadingRounds = (state: State) => state.loadingRounds;
