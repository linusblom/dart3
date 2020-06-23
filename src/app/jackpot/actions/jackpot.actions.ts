import { createAction, props } from '@ngrx/store';
import { Jackpot } from 'dart3-sdk';

export const getCurrentJackpotRequest = createAction('[User] Get Current Jackpot Request');
export const getCurrentJackpotSuccess = createAction(
  '[User] Get Current Jackpot Success',
  props<{ jackpot: Jackpot }>(),
);
export const getCurrentJackpotFailure = createAction('[User] Get Current Jackpot Failure');
