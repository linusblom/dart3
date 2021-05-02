import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Pagination, Player, PlayerStats, Role, Transaction } from 'dart3-sdk';

import { PlayerActions } from '@player/actions';
import { StoreState } from '@shared/models';

export interface PlayerState extends Player {
  transactions?: Pagination<Transaction>;
  statistics?: PlayerStats;
}

export interface State extends EntityState<PlayerState> {
  state: StoreState;
  selectedUid: string;
}

export const adapter: EntityAdapter<PlayerState> = createEntityAdapter<PlayerState>({
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
    selectedUid: undefined,
  })),

  on(PlayerActions.getSuccess, (state, { players }) =>
    adapter.upsertMany(players, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.getByUidSuccess, (state, { player }) =>
    adapter.upsertOne(player, { ...state, state: StoreState.NONE, selectedUid: player.uid }),
  ),

  on(
    PlayerActions.updateRequest,
    PlayerActions.resetPinRequest,
    PlayerActions.sendEmailVerificationRequest,
    (state) => ({
      ...state,
      state: StoreState.UPDATING,
    }),
  ),

  on(PlayerActions.updateSuccess, (state, { player }) =>
    adapter.updateOne(player, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.deleteRequest, (state) => ({ ...state, state: StoreState.DELETING })),

  on(PlayerActions.deleteSuccess, (state, { uid }) =>
    adapter.removeOne(uid, { ...state, state: StoreState.NONE }),
  ),

  on(PlayerActions.disablePinSuccess, (state, { uid }) =>
    adapter.updateOne(
      {
        id: uid,
        changes: { roles: state.entities[uid].roles.filter((role) => role !== Role.Pin) },
      },
      { ...state, state: StoreState.NONE },
    ),
  ),

  on(PlayerActions.resetPinSuccess, (state, { uid }) =>
    adapter.updateOne(
      {
        id: uid,
        changes: {
          roles: [...state.entities[uid].roles.filter((role) => role !== Role.Pin), Role.Pin],
        },
      },
      { ...state, state: StoreState.NONE },
    ),
  ),

  on(PlayerActions.createTransactionSuccess, (state, { uid, balance }) =>
    adapter.updateOne(
      {
        id: uid,
        changes: { balance },
      },
      state,
    ),
  ),

  on(PlayerActions.getTransactionsSuccess, (state, { uid, transactions }) =>
    adapter.updateOne(
      {
        id: uid,
        changes: { transactions },
      },
      state,
    ),
  ),

  on(PlayerActions.getStatisticsSuccess, (state, { uid, statistics }) =>
    adapter.updateOne(
      {
        id: uid,
        changes: { statistics },
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
    PlayerActions.sendEmailVerificationSuccess,
    PlayerActions.sendEmailVerificationFailure,
    (state) => ({
      ...state,
      state: StoreState.NONE,
    }),
  ),
);

export const { selectAll } = adapter.getSelectors();
