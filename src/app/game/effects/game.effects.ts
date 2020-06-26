import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, catchError, withLatestFrom, switchMap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { GameService } from '@game/services';
import { GameActions, WizardActions } from '@game/actions';
import { State, getWizardValues } from '@game/reducers';
import { GameWizardStep } from '@game/models';

@Injectable()
export class GameEffects {
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createRequest),
      withLatestFrom(this.store.pipe(select(getWizardValues))),
      concatMap(([_, payload]) =>
        this.service.create(payload).pipe(
          switchMap(game => [
            GameActions.createSuccess({ game }),
            WizardActions.setStep({ step: GameWizardStep.SelectPlayers }),
          ]),
          catchError(() => [GameActions.createFailure()]),
        ),
      ),
    ),
  );

  getByUid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.getByUidRequest),
      concatMap(({ uid }) =>
        this.service.getByUid(uid).pipe(
          map(game => GameActions.getByUidSuccess({ game })),
          catchError(() => [GameActions.getByUidFailure()]),
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
