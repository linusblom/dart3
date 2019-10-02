import { createAction, props } from '@ngrx/store';

import { Jackpot } from '@core/models';

export const valueChangesInit = createAction('[Account] Load Jackpot', props<{ id: string }>());
export const valueChangesSuccess = createAction(
  '[Account] Load Jackpot Success',
  props<{ jackpot: Jackpot }>(),
);
export const valueChangesFailure = createAction('[Account] Load Jackpot Failure');
export const valueChangesDestroy = createAction('[Account] Load Jackpot Destroy');
