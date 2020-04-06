import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, concatMap, catchError } from 'rxjs/operators';

import { AccountActions, AuthActions } from '@auth/actions';
import { AccountService } from '@auth/services';

@Injectable()
export class AccountEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.getRequest, AuthActions.login),
      concatMap(() =>
        this.service.get().pipe(
          map(account => AccountActions.getSuccess({ account })),
          catchError(() => [AccountActions.getFailure()]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: AccountService) {}
}
