import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { Account } from '@core/models';

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
