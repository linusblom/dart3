import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, race, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { AuthActions } from '@core/actions';
import { Jackpot, Permission } from '@core/models';
import { Actions, ofType } from '@ngrx/effects';
import { Player } from '@player/models';
import {
  getAllPlayers,
  getAuthLoading,
  getAuthUser,
  getJackpot,
  getPermissions,
  State,
} from '@root/reducers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnDestroy {
  Permission = Permission;

  loading$: Observable<boolean>;
  credits$: Observable<{ name: string; value: number }[]>;
  totalTurnover$: Observable<number>;

  permissions: Permission[] = [];
  noPermissionIcon = faTimesCircle;
  displayName = new FormControl('', Validators.required);
  passwordForm = new FormGroup(
    {
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    formGroup => {
      const { newPassword, confirmPassword } = formGroup.value;
      return newPassword !== confirmPassword ? { passwordInvalid: true } : null;
    },
  );

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly actions$: Actions) {
    this.loading$ = store.pipe(select(getAuthLoading));

    store
      .pipe(
        select(getAuthUser),
        takeUntil(this.destroy$),
        filter(user => !!user),
      )
      .subscribe(({ displayName }) => this.displayName.setValue(displayName, { emitEvent: false }));

    store
      .pipe(
        select(getPermissions),
        takeUntil(this.destroy$),
      )
      .subscribe(permissions => (this.permissions = permissions));

    this.credits$ = combineLatest([
      store.pipe(select(getAllPlayers)),
      store.pipe(select(getJackpot)),
    ]).pipe(
      filter(() => this.hasPermission(Permission.CORE_TOTAL_CREDITS_READ)),
      map(([players, jackpot]: [Player[], Jackpot]) => [
        { name: 'Players', value: players.reduce((acc, { credits }) => acc + credits, 0) },
        { name: 'Jackpot', value: jackpot.value },
        { name: 'Next Jackpot', value: jackpot.next },
      ]),
      map(credits => [
        ...credits,
        { name: 'Total', value: credits.reduce((acc, { value }) => acc + value, 0) },
      ]),
    );

    this.totalTurnover$ = store
      .pipe(select(getAllPlayers))
      .pipe(map(players => players.reduce((acc, { turnover }) => acc + turnover, 0)));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  hasPermission(permission: Permission) {
    return this.permissions.includes(permission);
  }

  onChangeDisplayName() {
    if (this.displayName.valid) {
      this.store.dispatch(AuthActions.updateProfile({ displayName: this.displayName.value }));
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const { password, newPassword } = this.passwordForm.value;
      this.store.dispatch(
        AuthActions.reauthenticate({
          password,
          action: AuthActions.updatePassword({ newPassword }),
        }),
      );

      race(
        this.actions$.pipe(ofType(AuthActions.reauthenticateFailure)),
        this.actions$.pipe(ofType(AuthActions.updatePasswordSuccess)),
        this.actions$.pipe(ofType(AuthActions.updatePasswordFailure)),
      )
        .pipe(take(1))
        .subscribe(({ type }) => {
          if (type === AuthActions.reauthenticateFailure.type) {
            this.passwordForm.get('password').setErrors({ invalid: true });
          } else if (type === AuthActions.updatePasswordSuccess.type) {
            this.passwordForm.reset();
          }
        });
    }
  }
}
