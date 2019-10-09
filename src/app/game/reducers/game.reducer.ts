import { GameActions } from '@game/actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Game } from '@game/models';
import { StoreState } from '@shared/models';

export interface State extends EntityState<Game> {
  state: StoreState;
  selectedGameId: string;
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
  on(GameActions.get, GameActions.list, GameActions.getGamePlayers, state => ({
    ...state,
    state: StoreState.FETCHING,
  })),
  on(GameActions.getSuccess, (state, { game }) =>
    adapter.addOne(game, { ...state, selectedGameId: game.id }),
  ),
  on(GameActions.getFailure, state => ({ ...state, state: StoreState.NONE })),
  on(GameActions.listSuccess, (state, { games }) =>
    adapter.addMany(games, { ...state, state: StoreState.NONE }),
  ),
  on(GameActions.getGamePlayersSuccess, (state, { updates }) =>
    adapter.updateMany(updates, { ...state, state: StoreState.NONE }),
  ),
);
