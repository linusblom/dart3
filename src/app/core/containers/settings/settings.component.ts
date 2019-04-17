import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getAuthUser, State } from '@root/app.reducer';
import { updateProfile } from '@root/auth/actions/auth.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnDestroy {
  icon = faCog;
  displayName = new FormControl('', Validators.required);

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    store
      .pipe(
        select(getAuthUser),
        takeUntil(this.destroy$),
      )
      .subscribe(({ displayName }) => this.displayName.setValue(displayName, { emitEvent: false }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onChangeDisplayName() {
    if (this.displayName.valid) {
      this.store.dispatch(updateProfile({ displayName: this.displayName.value }));
    }
  }
}
