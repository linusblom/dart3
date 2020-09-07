import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bank, Jackpot } from 'dart3-sdk';

import { State, getUser, getJackpot } from '@root/reducers';
import { UserActions } from '@user/actions';
import { AuthActions } from '@auth/actions';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnDestroy {
  user$ = this.store.pipe(select(getUser));
  jackpot$ = this.store.pipe(select(getJackpot));

  bank = {} as Bank;
  jackpot = {} as Jackpot;
  total = 0;
  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  settingsForm = new FormGroup({
    currency: new FormControl('', Validators.required),
  });

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>) {
    this.store.dispatch(UserActions.getRequest());

    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ name, nickname, email, userMetadata }) => {
        this.userForm.patchValue({ name, nickname, email });
        this.settingsForm.patchValue({ ...userMetadata });
      });

    combineLatest([this.user$, this.jackpot$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([{ bank }, jackpot]) => {
        this.bank = bank;
        this.jackpot = jackpot;
        this.total =
          +bank.players + +bank.inPlay + +jackpot.value + +jackpot.nextValue + +bank.rake;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  updateUser() {
    if (this.userForm.valid) {
      this.store.dispatch(UserActions.updateRequest({ user: this.userForm.value }));
    }
  }

  updateSettings() {
    if (this.settingsForm.valid) {
      this.store.dispatch(
        UserActions.updateRequest({ user: { userMetadata: this.settingsForm.value } }),
      );
    }
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
