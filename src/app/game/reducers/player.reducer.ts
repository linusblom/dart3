import {
  createPlayer,
  createPlayerFailue,
  createPlayerSuccess,
  loadPlayers,
  loadPlayersDestroy,
  loadPlayersFailure,
  loadPlayersSuccess,
  PlayerActionsUnion,
} from '@game/actions/player.actions';
import { Player } from '@game/models';

export interface State {
  players: Player[];
  loadingPlayers: boolean;
  loadingCreatePlayer: boolean;
}

export const initialState: State = {
  players: [],
  loadingPlayers: false,
  loadingCreatePlayer: false,
};

export function reducer(state = initialState, action: PlayerActionsUnion) {
  switch (action.type) {
    case createPlayer.type:
      return {
        ...state,
        loadingCreatePlayer: true,
      };

    case createPlayerSuccess.type:
      return {
        ...state,
        loadingCreatePlayer: false,
      };

    case createPlayerFailue.type:
      return {
        ...state,
        loadingCreatePlayer: false,
      };

    case loadPlayers.type:
      return {
        ...state,
        loadingPlayers: true,
      };

    case loadPlayersSuccess.type:
      return {
        ...state,
        players: action.players,
        loadingPlayers: false,
      };

    case loadPlayersFailure.type:
      return {
        ...state,
        loadingPlayers: false,
      };

    case loadPlayersDestroy.type:
      return {
        ...state,
        players: [],
      };

    default:
      return state;
  }
}
