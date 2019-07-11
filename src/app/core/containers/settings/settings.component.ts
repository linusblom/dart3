import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AuthActions } from '@core/actions';
import { Permission } from '@core/models';
import { getAuthLoading, getAuthUser, getPermissions, State } from '@root/reducers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnDestroy {
  Permission = Permission;

  loading$: Observable<boolean>;

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

  constructor(private readonly store: Store<State>) {
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
      const action = AuthActions.updatePassword({ newPassword });
      this.store.dispatch(AuthActions.reauthenticate({ password, action }));
    }
  }
}
