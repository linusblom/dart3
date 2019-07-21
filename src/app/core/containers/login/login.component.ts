import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';

import { AuthActions } from '@core/actions';
import { getAuthLoading, State } from '@root/reducers';
import { first, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('loginAnimation', [
      state('hide', style({ height: '0', opacity: '0' })),
      transition('hide => show', [
        sequence([
          animate('300ms ease-in-out', style({ height: '*' })),
          animate('200ms ease-in-out', style({ opacity: '1' })),
        ]),
      ]),
    ]),
  ],
})
export class LoginComponent {
  loading$: Observable<boolean>;
  loginForm: FormGroup;
  openForm = false;

  @HostListener('keyup', ['$event.keyCode'])
  onKeyDown(keyCode: number) {
    if (keyCode === 13) {
      this.login();
    }
  }

  constructor(private readonly formBuilder: FormBuilder, private readonly store: Store<State>) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.loading$ = store.pipe(
      select(getAuthLoading),
      shareReplay(1),
    );

    timer(1500)
      .pipe(first())
      .subscribe(() => (this.openForm = true));
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.store.dispatch(AuthActions.login({ email, password }));
  }
}
