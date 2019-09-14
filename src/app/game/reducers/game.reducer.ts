import { createReducer, on } from '@ngrx/store';

import { GameActions } from '@game/actions';
import { Game, JackpotRound } from '@game/models';

export interface State extends Game {
  loadingGame: boolean;
  loadingPlayers: boolean;
  jackpotRound: JackpotRound;
  playingJackpot: boolean;
  turnText: string;
}

export const initialState: State = {
  id: null,
  type: null,
  bet: 0,
  started: 0,
  ended: 0,
  players: [],
  playerIds: [],
  prizePool: 0,
  currentTurn: 0,
  currentRound: 0,
  loadingGame: false,
  loadingPlayers: false,
  playingJackpot: false,
  jackpotRound: null,
  turnText: '',
};

export const reducer = createReducer(
  initialState,
  on(GameActions.updateGame, (state, { data }) => ({ ...state, ...data })),
  on(GameActions.updateGameSuccess, state => ({ ...state, loadingGame: false })),
  on(GameActions.loadGame, state => ({ ...state, loadingGame: true })),
  on(GameActions.loadGameSuccess, (state, { game }) => ({ ...state, ...game, loadingGame: false })),
  on(GameActions.loadGameFailure, state => ({ ...state, loadingGame: false })),
  on(GameActions.endTurn, state => ({ ...state, loadingPlayers: true })),
  on(GameActions.nextTurn, state => ({ ...state, loadingGame: true, playingJackpot: false })),
  on(GameActions.loadGamePlayers, state => ({ ...state, loadingPlayers: true })),
  on(GameActions.loadGamePlayersSuccess, (state, { players }) => ({
    ...state,
    players,
    loadingPlayers: false,
  })),
  on(GameActions.loadGamePlayersFailure, state => ({ ...state, loadingPlayers: false })),
  on(GameActions.loadGameDestroy, () => initialState),
  on(GameActions.jackpotGameSetRound, (state, { jackpotRound }) => ({ ...state, jackpotRound })),
  on(GameActions.jackpotGameStart, state => ({ ...state, playingJackpot: true })),
  on(GameActions.setTurnText, (state, { text }) => ({ ...state, turnText: text })),
);
