import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { Game, GameType, Round, Score, ScoreBoard } from '@game/models';

export const updateGame = createAction('[Game] Update Game', props<{ data: Partial<Game> }>());
export const updateGameSuccess = createAction('[Game] Update Game Success');
export const updateGameFailure = createAction(
  '[Game] Update Game Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const createGame = createAction(
  '[Game] Create Game',
  props<{ gameType: GameType; bet: number; players: string[] }>(),
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

export const loadRound = createAction('[Game] Load Round', props<{ gameId: string }>());
export const loadRoundSuccess = createAction(
  '[Game] Load Round Success',
  props<{ rounds: Round[] }>(),
);
export const loadRoundFailure = createAction(
  '[Game] Load Round Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadRoundDestroy = createAction('[Game] Load Round Destroy');

export const endTurn = createAction(
  '[Game] End Turn',
  props<{ gameId: string; turn: number; round: number; scores: Score[] }>(),
);
export const endTurnSuccess = createAction('[Game] End Turn Success', props<{ gameId: string }>());
export const endTurnFailure = createAction(
  '[Game] End Turn Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updateScoreBoard = createAction(
  '[Game] Update ScoreBoard',
  props<{ scoreboard: ScoreBoard }>(),
);

export const createRound = createAction(
  '[Game] Create Round',
  props<{ gameId: string; round: number; playerCount: number }>(),
);
export const createRoundSuccess = createAction('[Game] Create Round Success');
export const createRoundFailure = createAction(
  '[Game] Create Round Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const endGame = createAction('[Game] End Game', props<{ gameId: string }>());
export const endGameSuccess = createAction('[Game] End Game Success', props<{ gameId: string }>());
export const endGameFailure = createAction(
  '[Game] End Game Failure',
  props<{ error: HttpErrorResponse }>(),
);
