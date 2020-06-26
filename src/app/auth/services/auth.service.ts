import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { Store } from '@ngrx/store';
import { combineLatest, from, of, throwError } from 'rxjs';
import { catchError, concatMap, shareReplay, tap } from 'rxjs/operators';

import { AuthActions } from '@auth/actions';
import { environment } from '@envs/environment';
import { State } from '@root/reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth0Client$ = from(
    createAuth0Client({
      domain: environment.auth0.domain,
      client_id: environment.auth0.clientId,
      redirect_uri: `${environment.siteUrl}/callback`,
      audience: `${environment.auth0.audience}`,
      scope: 'openid profile email',
    }),
  ).pipe(
    shareReplay(1),
    catchError(err => throwError(err)),
  );

  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
  );

  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback())),
  );

  accessToken$ = this.auth0Client$.pipe(concatMap(client => from(client.getTokenSilently())));

  constructor(private readonly router: Router, private readonly store: Store<State>) {
    this.localAuthSetup();
    this.handleAuthCallback();
  }

  getUser$(options?: GetUserOptions) {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
    );
  }

  private localAuthSetup() {
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          return this.getUser$();
        }

        return of(loggedIn);
      }),
    );
    checkAuth$.subscribe();
  }

  login(redirectPath: string = '/') {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.loginWithRedirect({
        redirect_uri: `${environment.siteUrl}/callback`,
        appState: { target: redirectPath },
      });
    });
  }

  private handleAuthCallback() {
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute = '/';
      const authComplete$ = this.handleRedirectCallback$.pipe(
        tap(cbRes => {
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => combineLatest([this.getUser$(), this.isAuthenticated$])),
      );

      authComplete$.subscribe(() => {
        this.store.dispatch(AuthActions.login());
        this.router.navigate([targetRoute]);
      });
    }
  }

  logout() {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.logout({
        client_id: environment.auth0.clientId,
        returnTo: `${environment.siteUrl}`,
      });
    });
  }
}
