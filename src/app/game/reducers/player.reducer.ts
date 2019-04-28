import { loadPlayersSuccess, PlayerActionsUnion } from '@game/actions/player.actions';
import { Player } from '@game/models/player';

export interface State {
  players: Player[];
}

export const initialState: State = {
  players: [],
};

export function reducer(state = initialState, action: PlayerActionsUnion) {
  switch (action.type) {
    case loadPlayersSuccess.type:
      console.log(action);
      return {
        ...state,
        players: action.players,
      };

    default:
      return state;
  }
}
