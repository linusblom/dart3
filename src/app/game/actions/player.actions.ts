import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { Player, Score, Transaction, TransactionPayload } from '@game/models';

export const loadPlayers = createAction('[Player] Load Players');
export const loadPlayersSuccess = createAction(
  '[Player] Load Players Success',
  props<{ players: Player[] }>(),
);
export const loadPlayersFailure = createAction(
  '[Player] Load Players Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadPlayersDestroy = createAction('[Player] Load Players Destroy');

export const createPlayer = createAction('[Player] Create Player', props<{ name: string }>());
export const createPlayerSuccess = createAction('[Player] Create Player Success');
export const createPlayerFailure = createAction(
  '[Player] Create Player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updatePlayer = createAction(
  '[Player] Update player',
  props<{ id: string; data: Partial<Player> }>(),
);
export const updatePlayerSuccess = createAction('[Player] Update player Success');
export const updatePlayerFailure = createAction(
  '[Player] Update player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updatePlayerStats = createAction(
  '[Player] Update Player Stats',
  props<{ id: string; scores: Score[] }>(),
);
export const updatePlayerStatsSuccess = createAction('[Player] Update Player Stats Success');
export const updatePlayerStatsFailure = createAction(
  '[Player] Update Player Stats Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updateAvatar = createAction(
  '[Player] Update Avatar',
  props<{ id: string; file: File }>(),
);
export const updateAvatarSuccess = createAction('[Player] Update Avatar Success');
export const updateAvatarFailure = createAction(
  '[Player] Update Avatar Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const selectPlayer = createAction('[Player] Select Player', props<{ id: string }>());

export const createTransaction = createAction(
  '[Player] Create Transaction',
  props<{ playerId: string; transaction: TransactionPayload }>(),
);
export const createTransactionSuccess = createAction('[Player] Create Transaction Success');
export const createTransactionFailure = createAction(
  '[Player] Create Transaction Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const loadTransactions = createAction(
  '[Player] Load Transactions',
  props<{ playerId: string }>(),
);
export const loadTransactionsSuccess = createAction(
  '[Player] Load Transactions Success',
  props<{ transactions: Transaction[] }>(),
);
export const loadTransactionsFailure = createAction(
  '[Player] Load Transactions Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadTransactionsDestroy = createAction('[Player] Load Transactions Destroy');
