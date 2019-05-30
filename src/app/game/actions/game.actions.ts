import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { Game, GameType } from '@game/models';

export const updateGame = createAction(
  '[Game] Update Game Settings',
  props<{ data: Partial<Game> }>(),
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
