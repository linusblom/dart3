import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { State } from '@root/reducers';
import { AuthActions } from '@auth/actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private readonly auth: AuthService, private readonly store: Store<State>) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      tap((authenticated) => {
        if (!authenticated) {
          this.store.dispatch(AuthActions.loginRequest({ url: state.url }));
        }
      }),
    );
  }
}
