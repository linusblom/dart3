import { createAction, props } from '@ngrx/store';
import { Jackpot, RoundJackpot } from 'dart3-sdk';

export const getCurrentRequest = createAction('[Jackpot] Get Current Request');
export const getCurrentSuccess = createAction(
  '[Jackpot] Get Current Success',
  props<{ jackpot: Jackpot }>(),
);
export const getCurrentFailure = createAction('[Jackpot] Get Current Failure');

export const start = createAction('[Jackpot] Start', props<{ jackpot: RoundJackpot }>());

export const reset = createAction('[Jackpot] Reset');
