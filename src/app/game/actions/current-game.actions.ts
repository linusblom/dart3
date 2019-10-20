import { createAction, props } from '@ngrx/store';

import {
  BoardData,
  Game,
  GamePlayer,
  GameType,
  JackpotDrawType,
  JackpotRound,
  Score,
} from '@game/models';

export const start = createAction(
  '[Current Game] Start',
  props<{ gameType: GameType; bet: number; playerIds: string[] }>(),
);
export const startSuccess = createAction('[Current Game] Start Success');
export const startFailure = createAction('[Current Game] Start Failure');

export const valueChangesGameInit = createAction(
  '[Current Game] Value Changes Game Init',
  props<{ id: string }>(),
);
export const valueChangesGameSuccess = createAction(
  '[Current Game] Value Changes Game Success',
  props<{ game: Game }>(),
);
export const valueChangesGameFailure = createAction('[Current Game] Value Changes Game Failure');
export const valueChangesGameDestroy = createAction('[Current Game] Value Changes Game Destroy');

export const valueChangesGamePlayerInit = createAction(
  '[Current Game] Value Changes GamePlayer Init',
  props<{ id: string }>(),
);
export const valueChangesGamePlayerSuccess = createAction(
  '[Current Game] Value Changes GamePlayer Success',
  props<{ players: GamePlayer[] }>(),
);
export const valueChangesGamePlayerFailure = createAction(
  '[Current Game] Value Changes GamePlayer Failure',
);
export const valueChangesGamePlayerDestroy = createAction(
  '[Current Game] Value Changes GamePlayer Destroy',
);

export const endTurn = createAction('[Current Game] End Turn', props<{ scores: Score[] }>());
export const endTurnSuccess = createAction('[Current Game] End Turn Success');
export const endTurnFailure = createAction('[Current Game] End Turn Failure');

export const nextTurn = createAction('[Current Game] Next Turn');
export const nextTurnSuccess = createAction('[Current Game] Next Turn Success');
export const nextTurnFailure = createAction('[Current Game] Next Turn Failure');

export const jackpotGameStart = createAction(
  '[Current Game] Jackpot Game Start',
  props<{ jackpotDraw: JackpotDrawType; scores: Score[] }>(),
);
export const jackpotGameSetRound = createAction(
  '[Current Game] Jackpot Game Set Round',
  props<{ jackpotRound: JackpotRound }>(),
);

export const updateBoardData = createAction(
  '[Current Game] Update Board Data',
  props<{ boardData: BoardData }>(),
);

export const end = createAction('[Current Game] End');

export const abort = createAction('[Current Game] Abort');

export const clear = createAction('[Current Game] Clear');
