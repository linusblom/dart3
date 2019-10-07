import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { Game, GamePlayer } from '@game/models';
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
        this.gameService.get(id).pipe(
          map((game: Game) => GameActions.getSuccess({ game })),
          catchError(() => [GameActions.getFailure()]),
        ),
      ),
    ),
  );

  list$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.list),
      concatMap(({ options }) =>
        this.gameService.list(options).pipe(
          map((games: Game[]) => GameActions.listSuccess({ games })),
          catchError(() => [GameActions.listFailure()]),
        ),
      ),
    ),
  );

  getSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.getSuccess),
      map(({ game: { id } }) => GameActions.getGamePlayers({ ids: [id] })),
    ),
  );

  listSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.listSuccess),
      map(({ games }) => GameActions.getGamePlayers({ ids: games.map(({ id }) => id) })),
    ),
  );

  getGamePlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.getGamePlayers),
      concatMap(({ ids }) =>
        forkJoin(ids.map(id => this.gamePlayerService.list(id))).pipe(
          withLatestFrom(this.store.pipe(select(getAllPlayers))),
          map(([gamesGamePlayers, players]: [Omit<GamePlayer, 'base'>[][], Player[]]) =>
            gamesGamePlayers.map((gamePlayers, index) => ({
              id: ids[index],
              changes: { players: mergePlayer(gamePlayers, players) },
            })),
          ),
          map(updates => GameActions.getGamePlayersSuccess({ updates })),
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
