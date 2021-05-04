import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { shareReplay } from 'rxjs/operators';

import { CoreActions } from '@core/actions';
import { getVerifyEmail, State } from '@root/reducers';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent {
  verify$ = this.store.pipe(select(getVerifyEmail), shareReplay(1));
  disabled = false;

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<State>) {
    const { u: uid, t: token } = this.route.snapshot.queryParams;

    this.store.dispatch(CoreActions.getVerifyEmailRequest({ uid, token }));
  }

  verify() {
    this.disabled = true;
    this.store.dispatch(CoreActions.verifyEmailRequest());
  }
}
