import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { createGame, Game, GamePlayer } from '@game/models';
import { GamePlayerService, GameService } from '@game/services';

@Injectable()
export class GameEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.get),
      concatMap(({ id }) =>
        forkJoin(this.gameService.get(id), this.gamePlayerService.list(id)).pipe(
          map(([game, players]: [Game, GamePlayer[]]) =>
            GameActions.getSuccess({ game: createGame({ ...game, players }) }),
          ),
          catchError(() => [GameActions.getFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly gameService: GameService,
    private readonly gamePlayerService: GamePlayerService,
  ) {}
}
