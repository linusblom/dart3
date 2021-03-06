import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Game } from 'dart3-sdk';

import { StoreState } from '@shared/models';
import { GameActions, CurrentGameActions } from '@game/actions';

export interface State extends EntityState<Game> {
  state: StoreState;
  selectedId: number;
}

export const adapter: EntityAdapter<Game> = createEntityAdapter<Game>();

export const initialState: State = adapter.getInitialState({
  state: StoreState.NONE,
  selectedId: null,
});

export const reducer = createReducer(
  initialState,

  on(GameActions.createRequest, (state) => ({
    ...state,
    state: StoreState.CREATING,
  })),

  on(CurrentGameActions.getRequest, GameActions.getByUidRequest, (state) => ({
    ...state,
    state: StoreState.FETCHING,
  })),

  on(
    CurrentGameActions.createRoundRequest,
    CurrentGameActions.startRequest,
    CurrentGameActions.createTeamPlayerRequest,
    CurrentGameActions.deleteTeamPlayerRequest,
    (state) => ({ ...state, state: StoreState.UPDATING }),
  ),

  on(
    GameActions.createSuccess,
    CurrentGameActions.getSuccess,
    GameActions.getByUidSuccess,
    (state, { game }) =>
      adapter.upsertOne(game, { ...state, selectedId: game.id, state: StoreState.NONE }),
  ),

  on(GameActions.updateGame, (state, { game }) => adapter.updateOne(game, state)),

  on(
    GameActions.createFailure,
    GameActions.getByUidFailure,
    CurrentGameActions.getFailure,
    CurrentGameActions.createRoundFailure,
    CurrentGameActions.createRoundSuccess,
    CurrentGameActions.startSuccess,
    CurrentGameActions.startFailure,
    CurrentGameActions.createTeamPlayerSuccess,
    CurrentGameActions.createTeamPlayerFailure,
    CurrentGameActions.deleteTeamPlayerSuccess,
    CurrentGameActions.deleteTeamPlayerFailure,
    (state) => ({
      ...state,
      state: StoreState.NONE,
    }),
  ),
);
