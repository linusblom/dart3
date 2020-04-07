import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, concatMap, catchError } from 'rxjs/operators';

import { UserActions, AuthActions } from '@auth/actions';
import { UserService } from '@auth/services';

@Injectable()
export class UserEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getRequest, AuthActions.login),
      concatMap(() =>
        this.service.get().pipe(
          map(user => UserActions.getSuccess({ user })),
          catchError(() => [UserActions.getFailure()]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: UserService) {}
}
