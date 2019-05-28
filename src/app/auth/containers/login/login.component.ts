import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions } from '@auth/actions';
import { getAuthLoading, State } from '@root/app.reducer';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading$: Observable<boolean>;
  loginForm: FormGroup;

  @HostListener('keyup', ['$event.keyCode'])
  onKeyDown(keyCode: number) {
    if (keyCode === 13) {
      this.login();
    }
  }

  constructor(private readonly formBuilder: FormBuilder, private readonly store: Store<State>) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.loading$ = store.pipe(
      select(getAuthLoading),
      shareReplay(1),
    );
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.store.dispatch(AuthActions.login({ email, password }));
  }
}
