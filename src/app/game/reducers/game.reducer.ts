import { createReducer, on } from '@ngrx/store';

import { GameActions } from '@game/actions';
import { Game } from '@game/models';

export interface State extends Game {
  loadingGame: boolean;
  loadingPlayers: boolean;
}

export const initalState: State = {
  type: null,
  bet: 0,
  started: 0,
  ended: 0,
  players: [],
  playerOrder: [],
  prizePool: 0,
  currentTurn: 0,
  currentRound: 0,
  loadingGame: false,
  loadingPlayers: false,
};

export const reducer = createReducer(
  initalState,
  on(GameActions.updateGame, (state, { data }) => ({ ...state, ...data })),
  on(GameActions.updateGameSuccess, state => ({ ...state, loadingGame: false })),
  on(GameActions.loadGame, state => ({ ...state, loadingGame: true })),
  on(GameActions.loadGameSuccess, (state, { game }) => ({ ...state, ...game, loadingGame: false })),
  on(GameActions.loadGameFailure, state => ({ ...state, loadingGame: false })),
  on(GameActions.endTurn, state => ({ ...state, loadingGame: true })),
  on(GameActions.endTurnSuccess, state => ({ ...state, loadingPlayers: true })),
  on(GameActions.loadGamePlayers, state => ({ ...state, loadingPlayers: true })),
  on(GameActions.loadGamePlayersSuccess, (state, { players }) => ({
    ...state,
    players,
    loadingPlayers: false,
  })),
  on(GameActions.loadGamePlayersFailure, state => ({ ...state, loadingPlayers: false })),
);

export const getGame = (state: State) => state;
export const getLoadingGame = (state: State) => state.loadingGame;
export const getLoadingPlayers = (state: State) => state.loadingPlayers;
