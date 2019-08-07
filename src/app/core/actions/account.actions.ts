import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { Account, Jackpot } from '@core/models';

export const loadAccount = createAction('[Account] Load Account');
export const loadAccountSuccess = createAction(
  '[Account] Load Account Success',
  props<{ account: Account }>(),
);
export const loadAccountFailure = createAction(
  '[Account] Load Account Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadAccountDestroy = createAction('[Account] Load Account Destroy');

export const update = createAction('[Account] Update Account', props<{ data: Partial<Account> }>());
export const updateSuccess = createAction('[Account] Update Account Success');
export const updateFailure = createAction(
  '[Account] Update Account Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const loadJackpot = createAction('[Account] Load Jackpot', props<{ id: string }>());
export const loadJackpotSuccess = createAction(
  '[Account] Load Jackpot Success',
  props<{ jackpot: Jackpot }>(),
);
export const loadJackpotFailure = createAction(
  '[Account] Load Jackpot Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const loadJackpotDestroy = createAction('[Account] Load Jackpot Destroy');
