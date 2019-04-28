import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil } from 'rxjs/operators';

import {
  createPlayer,
  createPlayerFailue,
  createPlayerSuccess,
  loadPlayerFailure,
  loadPlayers,
  loadPlayersDestroy,
  loadPlayersSuccess,
} from '@game/actions/player.actions';
import { Player } from '@game/models/player';
import { PlayerService } from '@game/services';
import { State } from '@root/app.reducer';
import { push } from '@root/core/actions/notification.actions';
import { NotificationState } from '@root/core/models';

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
        catchError(error => [loadPlayerFailure(error)]),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<State>,
    private readonly service: PlayerService,
  ) {}
}
