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
  '[Game] Update Round',
  props<{ gameId: string; turn: number; round: number; scores: Score[] }>(),
);
export const endTurnSuccess = createAction('[Game] Update Round Success');
export const endTurnFailure = createAction(
  '[Game] Update Round Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updateScoreBoard = createAction(
  '[Game] Update ScoreBoard',
  props<{ scoreboard: ScoreBoard }>(),
);
