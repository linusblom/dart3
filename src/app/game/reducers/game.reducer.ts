import { createReducer, on } from '@ngrx/store';

import { GameActions } from '@game/actions';
import { Game, GameData, JackpotRound } from '@game/models';

export interface State {
  game: Game;
  data: GameData;
  loadingGame: boolean;
  loadingPlayers: boolean;
  jackpotRound: JackpotRound;
  playingJackpot: boolean;
}

export const initialState: State = {
  game: {
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
  },
  data: {
    roundHeaders: [],
    totalHeader: '',
    turnText: '',
  },
  loadingGame: false,
  loadingPlayers: false,
  playingJackpot: false,
  jackpotRound: null,
};

export const reducer = createReducer(
  initialState,
  on(GameActions.updateGame, (state, { data }) => ({ ...state, game: { ...state.game, ...data } })),
  on(GameActions.updateGameSuccess, state => ({ ...state, loadingGame: false })),
  on(GameActions.loadGame, state => ({ ...state, loadingGame: true })),
  on(GameActions.loadGameSuccess, (state, { game }) => ({
    ...state,
    game: { ...state.game, ...game },
    loadingGame: false,
  })),
  on(GameActions.loadGameFailure, state => ({ ...state, loadingGame: false })),
  on(GameActions.endTurn, state => ({ ...state, loadingPlayers: true })),
  on(GameActions.nextTurn, state => ({ ...state, loadingGame: true, playingJackpot: false })),
  on(GameActions.loadGamePlayers, state => ({ ...state, loadingPlayers: true })),
  on(GameActions.loadGamePlayersSuccess, (state, { players }) => ({
    ...state,
    game: { ...state.game, players },
    loadingPlayers: false,
  })),
  on(GameActions.loadGamePlayersFailure, state => ({ ...state, loadingPlayers: false })),
  on(GameActions.loadGameDestroy, () => initialState),
  on(GameActions.jackpotGameSetRound, (state, { jackpotRound }) => ({ ...state, jackpotRound })),
  on(GameActions.jackpotGameStart, state => ({ ...state, playingJackpot: true })),
  on(GameActions.updateGameData, (state, { data }) => ({ ...state, data })),
);
