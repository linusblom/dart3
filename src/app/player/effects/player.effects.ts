import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { PlayerActions } from '@player/actions';
import { PlayerService } from '@player/services';
import { AuthActions } from '@auth/actions';
import { Router } from '@angular/router';
import { State, getPin } from '@root/reducers';

@Injectable()
export class PlayerEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getRequest, AuthActions.login),
      concatMap(() =>
        this.service.get().pipe(
          map(players => PlayerActions.getSuccess({ players })),
          catchError(error => [PlayerActions.getFailure({ error })]),
        ),
      ),
    ),
  );

  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getByIdRequest),
      concatMap(({ id }) =>
        this.service.getById(id).pipe(
          map(player => PlayerActions.getByIdSuccess({ player })),
          catchError(error => [PlayerActions.getByIdFailure({ error })]),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.createRequest),
      concatMap(({ player }) =>
        this.service.create(player).pipe(
          map(player => PlayerActions.createSuccess({ player })),
          catchError(error => [PlayerActions.createFailure({ error })]),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updateRequest),
      concatMap(({ id, player }) =>
        this.service.update(id, player).pipe(
          map(player => PlayerActions.updateSuccess({ player })),
          catchError(error => [PlayerActions.updateFailure({ error })]),
        ),
      ),
    ),
  );

  resetPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.resetPinRequest),
      concatMap(({ id }) =>
        this.service.resetPin(id).pipe(
          map(() => PlayerActions.resetPinSuccess()),
          catchError(error => [PlayerActions.resetPinFailure({ error })]),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.deleteRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ id }, pin]) =>
        this.service.delete(id, pin).pipe(
          tap(() => this.router.navigate(['players'])),
          map(() => PlayerActions.deleteSuccess({ id })),
          catchError(error => [PlayerActions.deleteFailure({ error })]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: PlayerService,
    private readonly router: Router,
    private readonly store: Store<State>,
  ) {}
}
