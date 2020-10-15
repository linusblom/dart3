import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Transaction, TransactionType } from 'dart3-sdk';
import { Observable } from 'rxjs';

import { PlayerActions } from '@player/actions';
import { PlayerService } from '@player/services';
import { AuthActions } from '@auth/actions';
import { State, getPin, getAllPlayers } from '@root/reducers';

@Injectable()
export class PlayerEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.getRequest, AuthActions.login),
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
          map((player) => PlayerActions.createSuccess({ player })),
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
          map((player) =>
            PlayerActions.updateSuccess({ player: { id: player.uid, changes: player } }),
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

  transaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.transactionRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ uid, _type, transaction, receiverUid }, pin]) => {
        let service: () => Observable<Transaction>;

        switch (_type) {
          case TransactionType.Deposit:
            service = () => this.service.deposit(uid, pin, transaction);
            break;
          case TransactionType.Withdrawal:
            service = () => this.service.withdrawal(uid, pin, transaction);
            break;
          case TransactionType.Transfer:
            service = () => this.service.transfer(uid, pin, receiverUid, transaction);
            break;
          default:
            return [];
        }

        return service().pipe(
          map((transaction) => PlayerActions.transactionSuccess({ uid, transaction })),
          catchError((error) => [PlayerActions.transactionFailure({ error })]),
        );
      }),
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

  constructor(
    private readonly actions$: Actions,
    private readonly service: PlayerService,
    private readonly router: Router,
    private readonly store: Store<State>,
  ) {}
}
