import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AuthActions } from '@core/actions';
import { getAuthLoading, getAuthUser, State } from '@root/reducers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnDestroy {
  loading$: Observable<boolean>;
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
      const action = AuthActions.updatePassword({ newPassword });
      this.store.dispatch(AuthActions.reauthenticate({ password, action }));
    }
  }
}
