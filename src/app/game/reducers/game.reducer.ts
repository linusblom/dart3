import { createReducer, on } from '@ngrx/store';

import { GameActions } from '@game/actions';
import { Game, GameType } from '@game/models';

export const initalState: Game = {
  id: null,
  type: GameType.HALVEIT,
  bet: 10,
  started: 0,
  ended: 0,
  players: [],
  playerTurn: 0,
  prizePool: 0,
};

export const reducer = createReducer(
  initalState,
  on(GameActions.updateGame, (state, { data }) => ({ ...state, ...data })),
);

export const getGame = (game: Game) => game;
