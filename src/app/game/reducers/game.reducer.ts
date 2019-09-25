import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer } from '@ngrx/store';

import { Game } from '@game/models';

export interface State extends EntityState<Game> {
  loading: boolean;
  selectedGameId: string;
}

export const adapter: EntityAdapter<Game> = createEntityAdapter<Game>({
  selectId: (game: Game) => game.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  selectedGameId: null,
});

export const reducer = createReducer(initialState);
