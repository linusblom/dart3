import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { TransactionActions } from '@game/actions';
import { Transaction } from '@game/models';

export interface State extends EntityState<Transaction> {
  loading: boolean;
}

export const adapter: EntityAdapter<Transaction> = createEntityAdapter<Transaction>({
  selectId: (transaction: Transaction) => transaction.id,
  sortComparer: (a, b) => b.timestamp - a.timestamp,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export const reducer = createReducer(
  initialState,
  on(TransactionActions.loadTransactions, state => ({ ...state, loading: true })),
  on(TransactionActions.loadTransactionsSuccess, (state, { transactions }) =>
    adapter.upsertMany(transactions, { ...state, loading: false }),
  ),
  on(TransactionActions.loadTransactionsFailure, state => ({ ...state, loading: false })),
  on(TransactionActions.loadTransactionsDestroy, state => adapter.removeAll(state)),
);

export const getLoading = (state: State) => state.loading;
