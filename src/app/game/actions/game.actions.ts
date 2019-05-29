import { createAction, props } from '@ngrx/store';

import { Game } from '@game/models';

export const updateGame = createAction(
  '[Game] Update Game Settings',
  props<{ data: Partial<Game> }>(),
);
