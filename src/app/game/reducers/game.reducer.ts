import { createReducer, on } from '@ngrx/store';

import { GameActions, RoundActions } from '@game/actions';
import { Game } from '@game/models';

export interface State extends Game {
  loading: boolean;
}

export const initalState: State = {
  type: null,
  bet: 0,
  started: 0,
  ended: 0,
  players: [],
  prizePool: 0,
  loading: false,
  currentTurn: 0,
  currentRound: 0,
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
