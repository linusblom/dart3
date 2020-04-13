import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, catchError, withLatestFrom, switchMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { GameService } from '@game/services';
import { GameActions, WizardActions } from '@game/actions';
import { State, getWizardValues } from '@game/reducers';
import { GameWizardStep } from '@game/models';

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

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.deleteRequest),
      concatMap(({ id }) =>
        this.service.delete(id).pipe(
          map(() => GameActions.deleteSuccess()),
          catchError(() => [GameActions.deleteFailure()]),
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
