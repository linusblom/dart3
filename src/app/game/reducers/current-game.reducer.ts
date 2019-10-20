import { createReducer, on } from '@ngrx/store';

import { CurrentGameActions } from '@game/actions';
import { createGame, Game, JackpotRound } from '@game/models';

export interface State {
  game: Game;
  loadingGame: boolean;
  loadingPlayers: boolean;
  jackpotRound: JackpotRound;
  playingJackpot: boolean;
}

export const initialState: State = {
  game: createGame(),
  loadingGame: false,
  loadingPlayers: false,
  playingJackpot: false,
  jackpotRound: null,
};

export const reducer = createReducer(
  initialState,
  on(CurrentGameActions.valueChangesGameInit, state => ({ ...state, loadingGame: true })),
  on(CurrentGameActions.valueChangesGameSuccess, (state, { game }) => ({
    ...state,
    game: { ...state.game, ...game },
    loadingGame: false,
  })),
  on(CurrentGameActions.valueChangesGameFailure, state => ({ ...state, loadingGame: false })),
  on(CurrentGameActions.endTurn, state => ({ ...state, loadingPlayers: true })),
  on(CurrentGameActions.nextTurn, state => ({
    ...state,
    loadingGame: true,
    playingJackpot: false,
  })),
  on(CurrentGameActions.valueChangesGamePlayerInit, state => ({ ...state, loadingPlayers: true })),
  on(CurrentGameActions.valueChangesGamePlayerSuccess, (state, { players }) => ({
    ...state,
    game: { ...state.game, players },
    loadingPlayers: false,
  })),
  on(CurrentGameActions.valueChangesGamePlayerFailure, state => ({
    ...state,
    loadingPlayers: false,
  })),
  on(CurrentGameActions.jackpotGameSetRound, (state, { jackpotRound }) => ({
    ...state,
    jackpotRound,
  })),
  on(CurrentGameActions.jackpotGameStart, state => ({ ...state, playingJackpot: true })),
  on(CurrentGameActions.updateBoardData, (state, { boardData }) => ({
    ...state,
    game: { ...state.game, boardData },
  })),
  on(CurrentGameActions.clear, () => initialState),
);
