import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer } from '@ngrx/store';
import { Game } from 'dart3-sdk';

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

export const reducer = createReducer(initialState);
