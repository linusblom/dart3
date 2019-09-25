import { createAction, props } from '@ngrx/store';

import { BoardData, Game, GameType, JackpotDrawType, JackpotRound, Score } from '@game/models';

export const create = createAction(
  '[Game] Create Game',
  props<{ gameType: GameType; bet: number; playerIds: string[] }>(),
);
export const createSuccess = createAction('[Game] Create Game Success');
export const createFailure = createAction('[Game] Create Game Failure');

export const valueChangesInit = createAction('[Game] Load Game', props<{ id: string }>());
export const valueChangesSuccess = createAction(
  '[Game] Load Game Success',
  props<{ game: Game }>(),
);
export const valueChangesFailure = createAction('[Game] Load Game Failure');
export const valueChangesDestroy = createAction('[Game] Load Game Destroy');

export const endTurn = createAction('[Game] End Turn', props<{ scores: Score[] }>());
export const endTurnSuccess = createAction('[Game] End Turn Success');
export const endTurnFailure = createAction('[Game] End Turn Failure');

export const nextTurn = createAction('[Game] Next Turn');
export const nextTurnSuccess = createAction('[Game] Next Turn Success');
export const nextTurnFailure = createAction('[Game] Next Turn Failure');

export const jackpotGameStart = createAction(
  '[Game] Jackpot Game Start',
  props<{ jackpotDraw: JackpotDrawType; scores: Score[] }>(),
);
export const jackpotGameSetRound = createAction(
  '[Game] Jackpot Game Set Round',
  props<{ jackpotRound: JackpotRound }>(),
);

export const updateBoardData = createAction(
  '[Game] Update Game Data',
  props<{ boardData: BoardData }>(),
);

export const end = createAction('[Game] End Game');

export const abort = createAction('[Game] Abort Game');
