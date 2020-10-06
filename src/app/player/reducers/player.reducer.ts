import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Player } from 'dart3-sdk';
import { createReducer, on } from '@ngrx/store';

import { StoreState } from '@shared/models';
import { PlayerActions } from '@player/actions';

export interface State extends EntityState<Player> {
  state: StoreState;
  selectedUid: string;
}

export const adapter: EntityAdapter<Player> = createEntityAdapter<Player>({
  selectId: (player) => player.uid,
  sortComparer: (a, b) => {
    if (a.xp < b.xp) {
      return 1;
    }

    if (b.xp < a.xp) {
      return -1;
    }

    return a.createdAt > b.createdAt ? 1 : -1;
  },
});

export const initialState: State = adapter.getInitialState({
  state: StoreState.NONE,
  selectedUid: undefined,
});

export const reducer = createReducer(
  initialState,

  on(PlayerActions.createRequest, (state) => ({ ...state, state: StoreState.CREATING })),

  on(PlayerActions.createSuccess, (state, { player }) =>
    adapter.addOne(player, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.getRequest, PlayerActions.getByUidRequest, (state) => ({
    ...state,
    state: StoreState.FETCHING,
    selectedId: undefined,
  })),

  on(PlayerActions.getSuccess, (state, { players }) =>
    adapter.upsertMany(players, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.getByUidSuccess, (state, { player }) =>
    adapter.upsertOne(player, { ...state, state: StoreState.NONE, selectedUid: player.uid }),
  ),

  on(PlayerActions.updateRequest, PlayerActions.resetPinRequest, (state) => ({
    ...state,
    state: StoreState.UPDATING,
  })),

  on(PlayerActions.updateSuccess, (state, { player }) =>
    adapter.updateOne(player, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.deleteRequest, (state) => ({ ...state, state: StoreState.DELETING })),

  on(PlayerActions.deleteSuccess, (state, { uid }) =>
    adapter.removeOne(uid, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.transactionSuccess, (state, { uid, transaction }) =>
    adapter.updateOne(
      {
        id: uid,
        changes: {
          balance: transaction.balance,
          transactions: [transaction, ...state.entities[uid].transactions],
        },
      },
      state,
    ),
  ),

  on(
    PlayerActions.createFailure,
    PlayerActions.getFailure,
    PlayerActions.getByUidFailure,
    PlayerActions.updateFailure,
    PlayerActions.resetPinSuccess,
    PlayerActions.resetPinFailure,
    PlayerActions.deleteFailure,
    (state) => ({
      ...state,
      state: StoreState.NONE,
    }),
  ),
);

export const { selectAll } = adapter.getSelectors();
