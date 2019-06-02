import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil } from 'rxjs/operators';

import { RoundActions } from '@game/actions';
import { Round } from '@game/models';
import { RoundService } from '@game/services';

@Injectable()
export class RoundEffects {
  constructor(private readonly actions$: Actions, private readonly service: RoundService) {}

  endTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.endTurn),
      concatMap(({ gameId, turn, round, scores }) =>
        from(this.service.updateRound(gameId, turn, round, scores)).pipe(
          map(() => RoundActions.endTurnSuccess()),
          catchError(error => [RoundActions.endTurnFailure(error)]),
        ),
      ),
    ),
  );

  loadRounds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.loadRound),
      switchMap(({ gameId }) =>
        this.service.listen(gameId).pipe(
          takeUntil(this.actions$.pipe(ofType(RoundActions.loadRoundDestroy))),
          map((rounds: Round[]) => RoundActions.loadRoundSuccess({ rounds })),
          catchError(error => [RoundActions.loadRoundFailure(error)]),
        ),
      ),
    ),
  );
}
