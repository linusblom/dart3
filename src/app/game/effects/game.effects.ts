import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { catchError, concatMap, map, tap, withLatestFrom } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { createGame, Game, GamePlayer } from '@game/models';
import { State } from '@game/reducers';
import { GamePlayerService, GameService } from '@game/services';
import { mergePlayer } from '@game/utils/merge-player';
import { Player } from '@player/models';
import { getAllPlayers } from '@root/reducers';

@Injectable()
export class GameEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.get),
      concatMap(({ id }) =>
        forkJoin(this.gameService.get(id), this.gamePlayerService.list(id)).pipe(
          withLatestFrom(this.store.pipe(select(getAllPlayers))),
          map(([[game, gamePlayers], players]: [[Game, Omit<GamePlayer, 'base'>[]], Player[]]) => ({
            ...game,
            players: mergePlayer(gamePlayers, players),
          })),
          map(game => GameActions.getSuccess({ game: createGame(game) })),
          catchError(() => [GameActions.getFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly gameService: GameService,
    private readonly gamePlayerService: GamePlayerService,
    private readonly store: Store<State>,
  ) {}
}
