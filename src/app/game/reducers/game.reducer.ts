import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Game } from 'dart3-sdk';

import { StoreState } from '@shared/models';
import { GameActions, CurrentGameActions } from '@game/actions';

export interface State extends EntityState<Game> {
  state: StoreState;
  selectedGameId: number;
}

export const adapter: EntityAdapter<Game> = createEntityAdapter<Game>({
  selectId: (game: Game) => game.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  state: StoreState.NONE,
  selectedGameId: null,
});

export const reducer = createReducer(
  initialState,

  on(GameActions.createRequest, state => ({
    ...state,
    state: StoreState.CREATING,
  })),

  on(CurrentGameActions.getRequest, state => ({
    ...state,
    state: StoreState.FETCHING,
  })),

  on(GameActions.createSuccess, CurrentGameActions.getSuccess, (state, { game }) =>
    adapter.upsertOne(game, { ...state, selectedGameId: game.id, state: StoreState.NONE }),
  ),

  on(CurrentGameActions.submitRoundRequest, state => ({ ...state, state: StoreState.UPDATING })),

  on(
    GameActions.createFailure,
    CurrentGameActions.getFailure,
    CurrentGameActions.submitRoundFailure,
    state => ({
      ...state,
      state: StoreState.NONE,
    }),
  ),

  on(CurrentGameActions.submitRoundSuccess, (state, { response }) => ({
    ...state,
    state: StoreState.NONE,
    entities: {
      ...state.entities,
      [state.selectedGameId]: {
        ...state.entities[state.selectedGameId],
        gamePlayerId: response.gamePlayerId,
        players: state.entities[state.selectedGameId].players.map(player => ({
          ...player,
          ...(response.player.playerId === player.playerId && response.player),
        })),
      },
    },
  })),
);
