import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { PlayerActions } from '@game/actions';
import { Player } from '@game/models';

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
  selectedPlayerId: '',
});

export const reducer = createReducer(
  initialState,
  on(PlayerActions.createPlayer, state => ({ ...state, loadingCreatePlayer: true })),
  on(PlayerActions.createPlayerSuccess, PlayerActions.createPlayerFailure, state => ({
    ...state,
    loadingCreatePlayer: false,
  })),
  on(PlayerActions.loadPlayers, state => ({ ...state, loadingPlayers: true })),
  on(PlayerActions.loadPlayersSuccess, (state, { players }) =>
    adapter.upsertMany(players, { ...state, loadingPlayers: false }),
  ),
  on(PlayerActions.loadPlayersFailure, state => ({ ...state, loadingPlayers: false })),
  on(PlayerActions.loadPlayersDestroy, state => adapter.removeAll(state)),
  on(PlayerActions.selectPlayer, (state, { id }) => ({ ...state, selectedPlayerId: id })),
  on(PlayerActions.loadTransactionsSuccess, (state, { transactions }) =>
    adapter.updateOne({ id: state.selectedPlayerId, changes: { transactions } }, state),
  ),
);
