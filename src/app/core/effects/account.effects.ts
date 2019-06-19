import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, takeUntil } from 'rxjs/operators';

import { AccountActions } from '@core/actions';
import { Account } from '@core/models';
import { AccountService } from '@core/services';
import { from } from 'rxjs';

@Injectable()
export class AccountEffects {
  loadAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccount),
      switchMap(() =>
        this.service.listen().pipe(
          takeUntil(this.actions$.pipe(ofType(AccountActions.loadAccountDestroy))),
          map((account: Account) => AccountActions.loadAccountSuccess({ account })),
          catchError(error => [AccountActions.loadAccountFailure(error)]),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.update),
      concatMap(({ data }) =>
        from(this.service.update(data)).pipe(
          map(() => AccountActions.updateSuccess()),
          catchError(error => [AccountActions.updateFailure(error)]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: AccountService) {}
}
