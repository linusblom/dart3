import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { CoreActions } from '@core/actions';
import { CoreService } from '@core/services';
import { CurrentGameActions } from '@game/actions';
import { PlayerActions } from '@player/actions';
import { getVerifyToken, State } from '@root/reducers';
import { UserActions } from '@user/actions';

@Injectable()
export class CoreEffects {
  confirmPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.confirmPin),
      map((modal) => {
        const text = modal.admin
          ? `${modal.text}<br/><br/>This action <strong>requires an admin</strong>. Please enter admin PIN to confirm.`
          : `${modal.text} ${
              !modal.pinDisabled ? '<br/><br/>Please enter your PIN to confirm.' : ''
            }`;

        return CoreActions.showModal({
          modal: {
            header: modal.header,
            text,
            backdrop: {
              dismiss: true,
              ...(modal.cancelAction && { action: () => modal.cancelAction }),
            },
            cancel: {
              text: 'Cancel',
              dismiss: true,
              ...(modal.cancelAction && { action: () => modal.cancelAction }),
            },
            ok: {
              text: modal.okText || 'Confirm',
              color: modal.okColor,
              dismiss: true,
              action: (pin: string) =>
                CoreActions.confirmPinDispatch({ pin, action: modal.action }),
            },
            pin: modal.admin || !modal.pinDisabled,
          },
        });
      }),
    ),
  );

  confirmPinDispatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.confirmPinDispatch),
      switchMap(({ action }) => [action, CoreActions.confirmPinComplete()]),
    ),
  );

  invalidPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PlayerActions.deleteFailure,
        PlayerActions.createTransactionFailure,
        PlayerActions.disablePinFailure,
        CurrentGameActions.createTeamPlayerFailure,
      ),
      filter(({ error: { status } }) => status === 403),
      map(() =>
        CoreActions.showModal({
          modal: {
            header: 'Invalid PIN',
            text: 'PIN code entered is invalid.',
            backdrop: {
              dismiss: true,
            },
            ok: {
              dismiss: true,
            },
          },
        }),
      ),
    ),
  );

  invalidFileType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.uploadFailure),
      filter(({ error: { status } }) => status === 415),
      map(() =>
        CoreActions.showModal({
          modal: {
            header: 'Invalid image',
            text: 'Allowed images: gif, jpeg, png',
            backdrop: {
              dismiss: true,
            },
            ok: {
              dismiss: true,
            },
          },
        }),
      ),
    ),
  );

  insufficientFunds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.createTransactionFailure, CurrentGameActions.createTeamPlayerFailure),
      filter(({ error: { status } }) => status === 406),
      map(() =>
        CoreActions.showModal({
          modal: {
            header: 'Insufficient Funds',
            text: "You don't have enough funds to perform this transaction.",
            backdrop: {
              dismiss: true,
            },
            ok: {
              dismiss: true,
            },
          },
        }),
      ),
    ),
  );

  playSound$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CoreActions.playSound),
        tap(({ sound }) => {
          const audio = new Audio(`../../../../assets/${sound}`);
          audio.load();
          audio.play();
        }),
      ),
    { dispatch: false },
  );

  getVerifyEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.getVerifyEmailRequest),
      concatMap(({ uid, token }) =>
        this.service.getVerifyEmail(uid, token).pipe(
          map(({ email }) =>
            CoreActions.getVerifyEmailSuccess({ verify: { uid, token, email, verified: false } }),
          ),
          catchError(() => {
            this.router.navigate(['/404']);

            return [CoreActions.getVerifyEmailFailure()];
          }),
        ),
      ),
    ),
  );

  verifyEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.verifyEmailRequest),
      withLatestFrom(this.store.pipe(select(getVerifyToken))),
      concatMap(([_, { uid, token }]) =>
        this.service.verifyEmail(uid, token).pipe(
          map(() => CoreActions.verifyEmailSuccess()),
          catchError(() => {
            this.router.navigate(['/404']);

            return [CoreActions.verifyEmailFailure()];
          }),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: CoreService,
    private readonly router: Router,
    private readonly store: Store<State>,
  ) {}
}
