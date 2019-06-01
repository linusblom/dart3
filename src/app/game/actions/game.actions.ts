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

export const loadGame = createAction('[Game] Load Game', props<{ gameId: string }>());
export const loadGameSuccess = createAction('[Game] Load Game Success', props<{ game: Game }>());
export const loadGameFailure = createAction(
  '[Game] Load Game Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadGameDestroy = createAction('[Game] Load Game Destroy');
