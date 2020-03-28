import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { PlayerActions } from '@player/actions';
import { PlayerService } from '@player/services';
import { AuthActions } from '@auth/actions';
import { Router } from '@angular/router';

@Injectable()
export class PlayerEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getRequest, AuthActions.loginComplete),
      concatMap(() =>
        this.service.get().pipe(
          map(players => PlayerActions.getSuccess({ players })),
          catchError(() => [PlayerActions.getFailure()]),
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
          catchError(() => [PlayerActions.getByIdFailure()]),
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
          catchError(() => [PlayerActions.createFailure()]),
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
          catchError(() => [PlayerActions.updateFailure()]),
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
          catchError(() => [PlayerActions.resetPinFailure()]),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.deleteRequest),
      concatMap(({ id }) =>
        this.service.delete(id).pipe(
          tap(() => this.router.navigate(['players'])),
          map(() => PlayerActions.deleteSuccess({ id })),
          catchError(() => [PlayerActions.deleteFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: PlayerService,
    private readonly router: Router,
  ) {}
}
