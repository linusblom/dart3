import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Jackpot } from 'dart3-sdk';
import { catchError, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';

import { AccountActions, JackpotActions } from '@core/actions';
import { AccountService } from '@core/services';

@Injectable()
export class JackpotEffects {
  reload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.valueChangesSuccess),
      distinctUntilChanged(
        (prev, curr) => prev.account.currentJackpot === curr.account.currentJackpot,
      ),
      switchMap(({ account: { currentJackpot } }) => [
        JackpotActions.valueChangesDestroy(),
        JackpotActions.valueChangesInit({ id: currentJackpot }),
      ]),
    ),
  );

  valueChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JackpotActions.valueChangesInit),
      switchMap(({ id }) =>
        this.service.listenJackpot(id).pipe(
          takeUntil(this.actions$.pipe(ofType(JackpotActions.valueChangesDestroy))),
          map((jackpot: Jackpot) => JackpotActions.valueChangesSuccess({ jackpot })),
          catchError(() => [JackpotActions.valueChangesFailure()]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: AccountService) {}
}
