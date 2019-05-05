import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil } from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { PlayerActions } from '@game/actions';
import { Player } from '@game/models/player';
import { PlayerService } from '@game/services';

@Injectable()
export class PlayerEffects {
  createPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.createPlayer),
      concatMap(({ name }) =>
        from(this.service.create(name)).pipe(
          switchMap(() => [
            NotificationActions.push({
              status: Status.SUCCESS,
              message: `Player ${name} created!`,
            }),
            PlayerActions.createPlayerSuccess(),
          ]),
          catchError(error => [PlayerActions.createPlayerFailure(error)]),
        ),
      ),
    ),
  );

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.loadPlayers),
      switchMap(() =>
        this.service.list().pipe(
          takeUntil(this.actions$.pipe(ofType(PlayerActions.loadPlayersDestroy))),
          map((players: Player[]) => PlayerActions.loadPlayersSuccess({ players })),
          catchError(error => [PlayerActions.loadPlayersFailure(error)]),
        ),
      ),
    ),
  );

  updatePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updatePlayer),
      concatMap(({ id, data }) =>
        from(this.service.update(id, data)).pipe(
          map(() => PlayerActions.updatePlayerSuccess()),
          catchError(error => [PlayerActions.updatePlayerFailure(error)]),
        ),
      ),
    ),
  );

  uploadImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updateAvatar),
      concatMap(({ id, file }) =>
        from(this.service.updateAvatar(id, file)).pipe(
          map(() => PlayerActions.updateAvatarSuccess()),
          catchError(error => {
            console.log(error);
            return [PlayerActions.updateAvatarFailure(error)];
          }),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: PlayerService) {}
}
