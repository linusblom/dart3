import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';

import { AccountActions } from '@core/actions';
import { Account, Permission } from '@core/models';
import { AccountService } from '@core/services';
import { getPermissions, State } from '@root/reducers';

@Injectable()
export class AccountEffects {
  valueChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.valueChangesInit),
      switchMap(() =>
        this.service.valueChanges().pipe(
          takeUntil(this.actions$.pipe(ofType(AccountActions.valueChangesDestroy))),
          map((account: Account) => AccountActions.valueChangesSuccess({ account })),
          catchError(() => [AccountActions.valueChangesFailure()]),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.update),
      withLatestFrom(this.store.pipe(select(getPermissions))),
      filter(([_, permissions]) => permissions.includes(Permission.CORE_ACCOUNT_WRITE)),
      concatMap(([{ data }]) =>
        from(this.service.update(data)).pipe(
          map(() => AccountActions.updateSuccess()),
          catchError(() => [AccountActions.updateFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: AccountService,
    private readonly store: Store<State>,
  ) {}
}
