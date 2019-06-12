import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { Round, Score, ScoreBoard } from '@game/models';

export const loadRound = createAction('[Round] Load Round', props<{ gameId: string }>());
export const loadRoundSuccess = createAction(
  '[Round] Load Round Success',
  props<{ rounds: Round[] }>(),
);
export const loadRoundFailure = createAction(
  '[Round] Load Round Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadRoundDestroy = createAction('[Round] Load Round Destroy');

export const endTurn = createAction(
  '[Game] Update Round',
  props<{ gameId: string; turn: number; round: number; scores: Score[] }>(),
);
export const endTurnSuccess = createAction('[Game] Update Round Success');
export const endTurnFailure = createAction(
  '[Game] Update Round Failure',
  props<{ error: HttpErrorResponse }>(),
);
