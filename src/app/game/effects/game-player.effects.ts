import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';

import { GamePlayerActions } from '@game/actions';
import { GamePlayer } from '@game/models';
import { GamePlayerService } from '@game/services';

@Injectable()
export class GamePlayerEffects {
  valueChangesInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamePlayerActions.valueChangesInit),
      switchMap(({ id }) =>
        this.service.valueChanges(id).pipe(
          takeUntil(this.actions$.pipe(ofType(GamePlayerActions.valueChangesDestroy))),
          map((players: GamePlayer[]) => GamePlayerActions.valueChangesSuccess({ players })),
          catchError(() => [GamePlayerActions.valueChangesFailure()]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: GamePlayerService) {}
}
