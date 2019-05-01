import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil } from 'rxjs/operators';

import { push } from '@core/actions/notification.actions';
import { NotificationState } from '@core/models';
import {
  createPlayer,
  createPlayerFailue,
  createPlayerSuccess,
  loadPlayers,
  loadPlayersDestroy,
  loadPlayersFailure,
  loadPlayersSuccess,
} from '@game/actions/player.actions';
import { Player } from '@game/models/player';
import { PlayerService } from '@game/services';

@Injectable()
export class PlayerEffects {
  @Effect()
  createPlayer$ = this.actions$.pipe(
    ofType(createPlayer.type),
    concatMap(({ name }) =>
      from(this.service.create(name)).pipe(
        switchMap(() => [
          push({ state: NotificationState.SUCCESS, message: `Player ${name} created!` }),
          createPlayerSuccess(),
        ]),
        catchError(error => [createPlayerFailue(error)]),
      ),
    ),
  );

  @Effect()
  loadPlayers$ = this.actions$.pipe(
    ofType(loadPlayers.type),
    switchMap(() =>
      this.service.list().pipe(
        takeUntil(this.actions$.pipe(ofType(loadPlayersDestroy.type))),
        map((players: Player[]) => loadPlayersSuccess({ players })),
        catchError(error => [loadPlayersFailure(error)]),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: PlayerService) {}
}
