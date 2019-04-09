import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { logout } from '@auth/actions/auth.actions';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(logout.type),
    tap(() => this.router.navigate(['login'])),
  );

  constructor(private actions$: Actions, private router: Router) {}
}
