import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Player } from 'dart3-sdk';
import { createReducer, on } from '@ngrx/store';

import { StoreState } from '@shared/models';
import { PlayerActions } from '@player/actions';

export interface State extends EntityState<Player> {
  state: StoreState;
  selectedId: string;
}

export const adapter: EntityAdapter<Player> = createEntityAdapter<Player>({
  selectId: (player: Player) => player.id,
  sortComparer: (a, b) => {
    if (a.xp < b.xp) {
      return 1;
    }

    if (b.xp < a.xp) {
      return -1;
    }

    return a.created_at > b.created_at ? 1 : -1;
  },
});

export const initialState: State = adapter.getInitialState({
  state: StoreState.NONE,
  selectedId: undefined,
});

export const reducer = createReducer(
  initialState,

  on(PlayerActions.createRequest, state => ({ ...state, state: StoreState.CREATING })),

  on(PlayerActions.createSuccess, (state, { player }) =>
    adapter.addOne(player, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.getRequest, PlayerActions.getByIdRequest, state => ({
    ...state,
    state: StoreState.FETCHING,
    selectedId: undefined,
  })),

  on(PlayerActions.getSuccess, (state, { players }) =>
    adapter.upsertMany(players, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.getByIdSuccess, (state, { player }) =>
    adapter.upsertOne(player, { ...state, state: StoreState.NONE, selectedId: player.id }),
  ),

  on(
    PlayerActions.createFailure,
    PlayerActions.getFailure,
    PlayerActions.getByIdFailure,
    state => ({
      ...state,
      loadingCreatePlayer: StoreState.NONE,
    }),
  ),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
