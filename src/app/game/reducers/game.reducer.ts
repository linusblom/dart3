import { createReducer, on } from '@ngrx/store';

import { GameActions, RoundActions } from '@game/actions';
import { Game } from '@game/models';

export interface State extends Game {
  loading: boolean;
}

export const initalState: State = {
  id: null,
  type: null,
  bet: 0,
  started: 0,
  ended: 0,
  players: [],
  playerTurn: 0,
  prizePool: 0,
  loading: false,
  currentRound: 1,
};

export const reducer = createReducer(
  initalState,
  on(GameActions.updateGame, (state, { data }) => ({ ...state, ...data })),
  on(GameActions.updateGameSuccess, state => ({ ...state, loading: false })),
  on(GameActions.loadGame, state => ({ ...state, loading: true })),
  on(GameActions.loadGameSuccess, (state, { game }) => ({ ...state, ...game, loading: false })),
  on(GameActions.loadGameFailure, () => initalState),
  on(RoundActions.endTurn, state => ({ ...state, loading: true })),
);

export const getGame = (state: State) => state;
export const getLoadingGame = (state: State) => state.loading;
