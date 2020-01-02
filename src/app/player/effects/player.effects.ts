import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Player } from 'dart3-sdk';
import { from } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models/notification';
import { PlayerActions } from '@player/actions';
import { PlayerService } from '@player/services';
import { State } from '@root/reducers';
import { getSelectedPlayer } from '@root/reducers';

@Injectable()
export class PlayerEffects {
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.create),
      concatMap(({ name }) =>
        from(this.service.create(name)).pipe(
          switchMap(() => [
            NotificationActions.push({
              status: Status.SUCCESS,
              message: `Player ${name} created!`,
            }),
            PlayerActions.createSuccess(),
          ]),
          catchError(() => [PlayerActions.createFailure()]),
        ),
      ),
    ),
  );

  valueChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.valueChangesInit),
      switchMap(() =>
        this.service.valueChanges().pipe(
          takeUntil(this.actions$.pipe(ofType(PlayerActions.valueChangesDestroy))),
          map((players: Player[]) => PlayerActions.valueChangesSuccess({ players })),
          catchError(() => [PlayerActions.valueChangesFailure()]),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.update),
      concatMap(({ id, data }) =>
        from(this.service.update(id, data)).pipe(
          map(() => PlayerActions.updateSuccess()),
          catchError(() => [PlayerActions.updateFailure()]),
        ),
      ),
    ),
  );

  updateAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updateAvatar),
      concatMap(({ id, file }) =>
        from(this.service.updateAvatar(id, file)).pipe(
          map(() => PlayerActions.updateAvatarSuccess()),
          catchError(() => [PlayerActions.updateAvatarFailure()]),
        ),
      ),
    ),
  );

  updateStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updateStats),
      withLatestFrom(this.store.pipe(select(getSelectedPlayer))),
      concatMap(([{ id, scores }, player]) => {
        const { total, hits, misses } = scores.reduce(
          (acc, score) => {
            const hitTotal = score.score * score.multiplier;
            return {
              total: acc.total + hitTotal,
              hits: acc.hits + (hitTotal > 0 ? 1 : 0),
              misses: acc.misses + (hitTotal > 0 ? 0 : 1),
            };
          },
          {
            total: 0,
            hits: 0,
            misses: 0,
          },
        );

        return from(
          this.service.update(id, {
            hits: player.hits + hits,
            misses: player.misses + misses,
            xp: player.xp + total,
            highest: total > player.highest ? total : player.highest,
            oneHundredEighties: player.oneHundredEighties + (total === 180 ? 1 : 0),
          }),
        ).pipe(
          map(() => PlayerActions.updateStatsSuccess()),
          catchError(() => [PlayerActions.updateStatsFailure()]),
        );
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: PlayerService,
    private readonly store: Store<State>,
  ) {}
}
