import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil } from 'rxjs/operators';

import { RoundActions } from '@game/actions';
import { Calculate, GameType, Round } from '@game/models';
import { HalveItService, RoundService } from '@game/services';

@Injectable()
export class RoundEffects {
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
      switchMap(({ gameId, gameType }) =>
        this.service.listen(gameId).pipe(
          takeUntil(this.actions$.pipe(ofType(RoundActions.loadRoundDestroy))),
          map((rounds: Round[]) => {
            if (gameType) {
              rounds = this.calculateMap[gameType].calculate(rounds);
            }

            return RoundActions.loadRoundSuccess({ rounds });
          }),
          catchError(error => [RoundActions.loadRoundFailure(error)]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: RoundService,
    private readonly halveItService: HalveItService,
  ) {}

  calculateMap: { [key: string]: Calculate } = {
    [GameType.HALVEIT]: this.halveItService,
  };
}
