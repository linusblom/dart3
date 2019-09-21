import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, race, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { AuthActions } from '@core/actions';
import { Permission } from '@core/models';
import { Actions, ofType } from '@ngrx/effects';
import { getAuthLoading, getAuthUser, hasPermission, State } from '@root/reducers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnDestroy {
  loading$: Observable<boolean>;
  hasCorePasswordWrite$: Observable<boolean>;
  hasCoreAccountWrite$: Observable<boolean>;

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
    this.hasCoreAccountWrite$ = store.pipe(select(hasPermission(Permission.CORE_ACCOUNT_WRITE)));
    this.hasCorePasswordWrite$ = store.pipe(select(hasPermission(Permission.CORE_PASSWORD_WRITE)));

    store
      .pipe(
        select(getAuthUser),
        takeUntil(this.destroy$),
        filter(user => !!user),
      )
      .subscribe(({ displayName }) => this.displayName.setValue(displayName, { emitEvent: false }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
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
