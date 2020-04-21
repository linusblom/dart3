import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, catchError, withLatestFrom, switchMap, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';

import { GameService } from '@game/services';
import { CurrentGameAction, GameActions, WizardActions } from '@game/actions';
import { State, getWizardValues } from '@game/reducers';
import { GameWizardStep } from '@game/models';
import { getPin } from '@root/reducers';

@Injectable()
export class GameEffects {
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createRequest),
      withLatestFrom(this.store.pipe(select(getWizardValues))),
      concatMap(([_, { variant: type, ...rest }]) =>
        this.service.create({ type, ...rest }).pipe(
          switchMap(game => [
            GameActions.createSuccess({ game }),
            WizardActions.setStep({ step: GameWizardStep.SelectPlayers }),
          ]),
          catchError(() => [GameActions.createFailure()]),
        ),
      ),
    ),
  );

  getCurrent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameAction.getRequest),
      concatMap(() =>
        this.service.getCurrent().pipe(
          map(game => CurrentGameAction.getSuccess({ game })),
          catchError(error => [CurrentGameAction.getFailure({ error })]),
        ),
      ),
    ),
  );

  deleteCurrent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameAction.deleteRequest),
      concatMap(() =>
        this.service.deleteCurrent().pipe(
          map(() => CurrentGameAction.deleteSuccess()),
          catchError(() => [CurrentGameAction.deleteFailure()]),
        ),
      ),
    ),
  );

  createCurrentGamePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameAction.createGamePlayerRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ playerId }, pin]) =>
        this.service.createCurrentGamePlayer(playerId, pin).pipe(
          map(({ players }) => CurrentGameAction.createGamePlayerSuccess({ players })),
          catchError(error => [CurrentGameAction.createGamePlayerFailure({ error })]),
        ),
      ),
    ),
  );

  deleteCurrentGamePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameAction.deleteGamePlayerRequest),
      concatMap(({ playerId }) =>
        this.service.deleteCurrentGamePlayer(playerId).pipe(
          map(({ players }) => CurrentGameAction.deleteGamePlayerSuccess({ players })),
          catchError(error => [CurrentGameAction.deleteGamePlayerFailure({ error })]),
        ),
      ),
    ),
  );

  startCurrent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameAction.startRequest),
      concatMap(() =>
        this.service.start().pipe(
          tap(() => this.router.navigate(['/play'])),
          map(() => CurrentGameAction.startSuccess()),
          catchError(() => [CurrentGameAction.startFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: GameService,
    private readonly store: Store<State>,
    private readonly router: Router,
  ) {}
}
