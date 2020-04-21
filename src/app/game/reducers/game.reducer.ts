import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Game } from 'dart3-sdk';

import { StoreState } from '@shared/models';
import { GameActions, CurrentGameAction } from '@game/actions';

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

  on(CurrentGameAction.getRequest, state => ({
    ...state,
    state: StoreState.FETCHING,
  })),

  on(GameActions.createSuccess, CurrentGameAction.getSuccess, (state, { game }) =>
    adapter.upsertOne(game, { ...state, selectedGameId: game.id, state: StoreState.NONE }),
  ),

  on(GameActions.createFailure, CurrentGameAction.getFailure, state => ({
    ...state,
    state: StoreState.NONE,
  })),
);
