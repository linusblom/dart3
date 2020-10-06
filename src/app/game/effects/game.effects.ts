import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, catchError, withLatestFrom, switchMap, map, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { GameService } from '@game/services';
import { GameActions, WizardActions } from '@game/actions';
import { State, getWizardValues } from '@game/reducers';
import { GameWizardStep } from '@game/models';
import { PlayerActions } from '@player/actions';

@Injectable()
export class GameEffects {
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createRequest),
      withLatestFrom(this.store.pipe(select(getWizardValues))),
      concatMap(([_, payload]) =>
        this.service.create(payload).pipe(
          switchMap((game) => [
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
          map((game) => GameActions.getByUidSuccess({ game })),
          catchError(() => [GameActions.getByUidFailure()]),
        ),
      ),
    ),
  );

  updatePlayerXp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.getByUidSuccess),
      filter(({ game }) => !!game.results),
      switchMap(({ game }) =>
        game.results.map((result) =>
          PlayerActions.updateById({ id: result.playerId, changes: { xp: result.xp } }),
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
