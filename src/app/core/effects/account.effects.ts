import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';

import { AccountActions } from '@core/actions';
import { Account, Jackpot, Permission } from '@core/models';
import { AccountService } from '@core/services';
import { getPermissions, State } from '@root/reducers';

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
      withLatestFrom(this.store.pipe(select(getPermissions))),
      filter(([_, permissions]) => permissions.includes(Permission.CORE_ACCOUNT_WRITE)),
      concatMap(([{ data }]) =>
        from(this.service.update(data)).pipe(
          map(() => AccountActions.updateSuccess()),
          catchError(error => [AccountActions.updateFailure(error)]),
        ),
      ),
    ),
  );

  reloadJackpot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccountSuccess),
      distinctUntilChanged(
        (prev, curr) => prev.account.currentJackpot === curr.account.currentJackpot,
      ),
      switchMap(({ account: { currentJackpot } }) => [
        AccountActions.loadJackpotDestroy(),
        AccountActions.loadJackpot({ id: currentJackpot }),
      ]),
    ),
  );

  loadJackpot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadJackpot),
      switchMap(({ id }) =>
        this.service.listenJackpot(id).pipe(
          takeUntil(this.actions$.pipe(ofType(AccountActions.loadJackpotDestroy))),
          map((jackpot: Jackpot) => AccountActions.loadJackpotSuccess({ jackpot })),
          catchError(error => [AccountActions.loadJackpotFailure(error)]),
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
