import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { PlayerActions } from '@game/actions';
import { Player, Transaction } from '@game/models';
import { getSelectedPlayer, State } from '@game/reducers';
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
          catchError(() => [PlayerActions.createPlayerFailure()]),
        ),
      ),
    ),
  );

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.loadPlayers),
      switchMap(() =>
        this.service.listen().pipe(
          takeUntil(this.actions$.pipe(ofType(PlayerActions.loadPlayersDestroy))),
          map((players: Player[]) => PlayerActions.loadPlayersSuccess({ players })),
          catchError(() => [PlayerActions.loadPlayersFailure()]),
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
          catchError(() => [PlayerActions.updatePlayerFailure()]),
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
          catchError(() => [PlayerActions.updateAvatarFailure()]),
        ),
      ),
    ),
  );

  createTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.createTransaction),
      exhaustMap(({ playerId, transaction: { type, amount } }) =>
        from(this.service.createTransaction(playerId, type, amount)).pipe(
          map(() => PlayerActions.createTransactionSuccess()),
          catchError(() => [PlayerActions.createTransactionFailure()]),
        ),
      ),
    ),
  );

  loadTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.loadTransactions),
      switchMap(({ playerId }) =>
        this.service.listenTransactions(playerId).pipe(
          takeUntil(this.actions$.pipe(ofType(PlayerActions.loadTransactionsDestroy))),
          map((transactions: Transaction[]) =>
            transactions.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
          ),
          map((transactions: Transaction[]) =>
            PlayerActions.loadTransactionsSuccess({ transactions }),
          ),
          catchError(() => [PlayerActions.loadTransactionsFailure()]),
        ),
      ),
    ),
  );

  updatePlayerStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updatePlayerStats),
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
          map(() => PlayerActions.updatePlayerStatsSuccess()),
          catchError(() => [PlayerActions.updatePlayerStatsFailure()]),
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
