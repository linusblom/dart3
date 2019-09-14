import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { Game, GamePlayer, GameType, JackpotDrawType, JackpotRound, Score } from '@game/models';

export const updateGame = createAction('[Game] Update Game', props<{ data: Partial<Game> }>());
export const updateGameSuccess = createAction('[Game] Update Game Success');
export const updateGameFailure = createAction(
  '[Game] Update Game Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const createGame = createAction(
  '[Game] Create Game',
  props<{ gameType: GameType; bet: number; playerIds: string[] }>(),
);
export const createGameSuccess = createAction('[Game] Create Game Success');
export const createGameFailure = createAction(
  '[Game] Create Game Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const loadGame = createAction('[Game] Load Game', props<{ gameId: string }>());
export const loadGameSuccess = createAction('[Game] Load Game Success', props<{ game: Game }>());
export const loadGameFailure = createAction(
  '[Game] Load Game Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadGameDestroy = createAction('[Game] Load Game Destroy');

export const loadGamePlayers = createAction(
  '[Game] Load Game Players',
  props<{ gameId: string }>(),
);
export const loadGamePlayersSuccess = createAction(
  '[Game] Load Game Players Success',
  props<{ players: GamePlayer[] }>(),
);
export const loadGamePlayersFailure = createAction(
  '[Game] Load Game Players Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadGamePlayersDestroy = createAction('[Game] Load Game Players Destroy');

export const endTurn = createAction('[Game] End Turn', props<{ scores: Score[] }>());
export const endTurnSuccess = createAction('[Game] End Turn Success');
export const endTurnFailure = createAction(
  '[Game] End Turn Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const nextTurn = createAction('[Game] Next Turn');
export const nextTurnSuccess = createAction('[Game] Next Turn Success');
export const nextTurnFailure = createAction(
  '[Game] Next Turn Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const jackpotGameStart = createAction(
  '[Game] Jackpot Game Start',
  props<{ jackpotDraw: JackpotDrawType; scores: Score[] }>(),
);
export const jackpotGameSetRound = createAction(
  '[Game] Jackpot Game Set Round',
  props<{ jackpotRound: JackpotRound }>(),
);

export const setTurnText = createAction('[Game] Set Turn Text', props<{ text: string }>());
