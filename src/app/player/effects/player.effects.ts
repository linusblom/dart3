import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { CoreActions } from '@core/actions';
import { PlayerActions } from '@player/actions';
import { PlayerService } from '@player/services';
import { getAllPlayers, getPin, State } from '@root/reducers';

@Injectable()
export class PlayerEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getRequest),
      concatMap(() =>
        this.service.get().pipe(
          map((players) => PlayerActions.getSuccess({ players })),
          catchError((error) => [PlayerActions.getFailure({ error })]),
        ),
      ),
    ),
  );

  getByUid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getByUidRequest),
      concatMap(({ uid }) =>
        this.service.getByUid(uid).pipe(
          map((player) => PlayerActions.getByUidSuccess({ player })),
          catchError((error) => [PlayerActions.getByUidFailure({ error })]),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.createRequest),
      concatMap(({ player }) =>
        this.service.create(player).pipe(
          map((created) => PlayerActions.createSuccess({ player: created })),
          catchError((error) => [PlayerActions.createFailure({ error })]),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updateRequest),
      concatMap(({ uid, player }) =>
        this.service.update(uid, player).pipe(
          map((updated) =>
            PlayerActions.updateSuccess({ player: { id: updated.uid, changes: updated } }),
          ),
          catchError((error) => [PlayerActions.updateFailure({ error })]),
        ),
      ),
    ),
  );

  resetPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.resetPinRequest),
      concatMap(({ uid }) =>
        this.service.resetPin(uid).pipe(
          map(() => PlayerActions.resetPinSuccess({ uid })),
          catchError((error) => [PlayerActions.resetPinFailure({ error })]),
        ),
      ),
    ),
  );

  disablePin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.disablePinRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ uid }, pin]) =>
        this.service.disablePin(uid, pin).pipe(
          map(() => PlayerActions.disablePinSuccess({ uid })),
          catchError((error) => [PlayerActions.disablePinFailure({ error })]),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.deleteRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ uid }, pin]) =>
        this.service.delete(uid, pin).pipe(
          tap(() => this.router.navigate(['players'])),
          map(() => PlayerActions.deleteSuccess({ uid })),
          catchError((error) => [PlayerActions.deleteFailure({ error })]),
        ),
      ),
    ),
  );

  createTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.createTransactionRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ uid, transaction }, pin]) =>
        this.service.createTransaction(uid, pin, transaction).pipe(
          switchMap(({ balance }) => [
            PlayerActions.createTransactionSuccess({ uid, balance }),
            PlayerActions.getTransactionsRequest({ uid, limit: 15, offset: 0 }),
          ]),
          catchError((error) => [PlayerActions.createTransactionFailure({ error })]),
        ),
      ),
    ),
  );

  getTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getTransactionsRequest),
      concatMap(({ uid, limit, offset }) =>
        this.service.getTransactions(uid, limit, offset).pipe(
          map((transactions) => PlayerActions.getTransactionsSuccess({ uid, transactions })),
          catchError((error) => [PlayerActions.getTransactionsFailure({ error })]),
        ),
      ),
    ),
  );

  updateById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updateById),
      withLatestFrom(this.store.pipe(select(getAllPlayers))),
      map(([player, players]) => ({
        id: (players.find(({ id }) => id === player.id) || { uid: undefined }).uid,
        changes: player.changes,
      })),
      filter((player) => !!player.id),
      map((player) => PlayerActions.updateSuccess({ player })),
    ),
  );

  getStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getStatisticsRequest),
      concatMap(({ uid }) =>
        this.service.getStatistics(uid).pipe(
          map((statistics) => PlayerActions.getStatisticsSuccess({ uid, statistics })),
          catchError((error) => [PlayerActions.getStatisticsFailure(error)]),
        ),
      ),
    ),
  );

  sendEmailVerification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.sendEmailVerificationRequest),
      concatMap(({ uid }) =>
        this.service.sendEmailVerification(uid).pipe(
          switchMap(() => [
            PlayerActions.sendEmailVerificationSuccess(),
            CoreActions.showModal({
              modal: {
                header: 'E-mail sent',
                text: 'Check your inbox and click the link provided. Link is valid for 24 hours.',
                backdrop: {
                  dismiss: true,
                },
                ok: {
                  dismiss: true,
                },
              },
            }),
          ]),
          catchError(() => [PlayerActions.sendEmailVerificationFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: PlayerService,
    private readonly router: Router,
    private readonly store: Store<State>,
  ) {}
}
