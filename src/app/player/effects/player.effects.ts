import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { PlayerActions } from '@player/actions';
import { PlayerService } from '@player/services';
import { AuthActions } from '@auth/actions';

@Injectable()
export class PlayerEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getRequest, AuthActions.loginComplete),
      concatMap(() =>
        this.service.get().pipe(
          tap(player => console.log(player)),
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

  constructor(private readonly actions$: Actions, private readonly service: PlayerService) {}
}
