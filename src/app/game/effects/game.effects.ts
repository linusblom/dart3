import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, catchError, withLatestFrom, switchMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { GameService } from '@game/services';
import { GameActions, WizardActions } from '@game/actions';
import { State, getWizardValues } from '@game/reducers';
import { GameWizardStep } from '@game/models';
import { getPin } from '@root/reducers';

@Injectable()
export class GameEffects {
  getCurrent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.getCurrentRequest),
      concatMap(() =>
        this.service.getCurrent().pipe(
          map(game => GameActions.getCurrentSuccess({ game })),
          catchError(error => [GameActions.getCurrentFailure({ error })]),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createRequest),
      withLatestFrom(this.store.pipe(select(getWizardValues))),
      concatMap(([_, { variant: type, ...rest }]) =>
        this.service.create({ type, ...rest }).pipe(
          switchMap(game => [
            GameActions.createSuccess({ game }),
            WizardActions.setId({ id: game.id }),
            WizardActions.setStep({ step: GameWizardStep.SelectPlayers }),
          ]),
          catchError(() => [GameActions.createFailure()]),
        ),
      ),
    ),
  );

  deleteCurrent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.deleteCurrentRequest),
      concatMap(() =>
        this.service.deleteCurrent().pipe(
          map(() => GameActions.deleteCurrentSuccess()),
          catchError(() => [GameActions.deleteCurrentFailure()]),
        ),
      ),
    ),
  );

  createCurrentGamePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createCurrentGamePlayerRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ playerId }, pin]) =>
        this.service.createCurrentGamePlayer(playerId, pin).pipe(
          map(({ players }) => GameActions.createCurrentGamePlayerSuccess({ players })),
          catchError(error => [GameActions.createCurrentGamePlayerFailure({ error })]),
        ),
      ),
    ),
  );

  deleteCurrentGamePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.deleteCurrentGamePlayerRequest),
      concatMap(({ playerId }) =>
        this.service.deleteCurrentGamePlayer(playerId).pipe(
          map(({ players }) => GameActions.deleteCurrentGamePlayerSuccess({ players })),
          catchError(error => [GameActions.deleteCurrentGamePlayerFailure({ error })]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: GameService,
    private readonly store: Store<State>,
  ) {}
}
