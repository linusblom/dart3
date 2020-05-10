import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';

import { CurrentGameService } from '@game/services';
import { CurrentGameActions } from '@game/actions';
import { State } from '@game/reducers';
import { getPin } from '@root/reducers';

@Injectable()
export class CurrentGameEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.getRequest),
      concatMap(() =>
        this.service.get().pipe(
          map(game => CurrentGameActions.getSuccess({ game })),
          catchError(error => [CurrentGameActions.getFailure({ error })]),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.deleteRequest),
      concatMap(() =>
        this.service.delete().pipe(
          map(() => CurrentGameActions.deleteSuccess()),
          catchError(() => [CurrentGameActions.deleteFailure()]),
        ),
      ),
    ),
  );

  createGamePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createGamePlayerRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ playerId }, pin]) =>
        this.service.createGamePlayer(playerId, pin).pipe(
          map(({ players }) => CurrentGameActions.createGamePlayerSuccess({ players })),
          catchError(error => [CurrentGameActions.createGamePlayerFailure({ error })]),
        ),
      ),
    ),
  );

  deleteGamePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.deleteGamePlayerRequest),
      concatMap(({ playerId }) =>
        this.service.deleteGamePlayer(playerId).pipe(
          map(({ players }) => CurrentGameActions.deleteGamePlayerSuccess({ players })),
          catchError(error => [CurrentGameActions.deleteGamePlayerFailure({ error })]),
        ),
      ),
    ),
  );

  start$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.startRequest),
      concatMap(() =>
        this.service.start().pipe(
          tap(() => this.router.navigate(['/play'])),
          map(() => CurrentGameActions.startSuccess()),
          catchError(() => [CurrentGameActions.startFailure()]),
        ),
      ),
    ),
  );

  createRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.submitRoundRequest),
      concatMap(({ scores }) =>
        this.service.submitRound(scores).pipe(
          map(response => CurrentGameActions.submitRoundSuccess({ response })),
          catchError(() => [CurrentGameActions.submitRoundFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: CurrentGameService,
    private readonly store: Store<State>,
    private readonly router: Router,
  ) {}
}
