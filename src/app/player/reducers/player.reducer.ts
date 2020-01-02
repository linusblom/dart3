import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Player } from 'dart3-sdk';

import { PlayerActions, TransactionActions } from '@player/actions';

export interface State extends EntityState<Player> {
  loadingPlayers: boolean;
  loadingCreatePlayer: boolean;
  selectedPlayerId: string;
}

export const adapter: EntityAdapter<Player> = createEntityAdapter<Player>({
  selectId: (player: Player) => player.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loadingPlayers: false,
  loadingCreatePlayer: false,
  selectedPlayerId: undefined,
});

export const reducer = createReducer(
  initialState,
  on(PlayerActions.create, state => ({ ...state, loadingCreatePlayer: true })),
  on(PlayerActions.createSuccess, PlayerActions.createFailure, state => ({
    ...state,
    loadingCreatePlayer: false,
  })),
  on(PlayerActions.valueChangesInit, state => ({ ...state, loadingPlayers: true })),
  on(PlayerActions.valueChangesSuccess, (state, { players }) =>
    adapter.upsertMany(players, { ...state, loadingPlayers: false }),
  ),
  on(PlayerActions.valueChangesFailure, state => ({ ...state, loadingPlayers: false })),
  on(PlayerActions.valueChangesDestroy, state => adapter.removeAll(state)),
  on(PlayerActions.select, PlayerActions.updateStats, (state, { id }) => ({
    ...state,
    selectedPlayerId: id,
  })),
  on(TransactionActions.valueChangesSuccess, (state, { transactions }) =>
    adapter.updateOne({ id: state.selectedPlayerId, changes: { transactions } }, state),
  ),
);
