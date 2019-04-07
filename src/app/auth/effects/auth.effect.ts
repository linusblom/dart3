import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { AuthActionTypes } from '@auth/actions/auth.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.Logout),
    tap(() => this.router.navigate(['login'])),
  );

  constructor(private actions$: Actions, private router: Router) {}
}
