import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, concatMap, catchError } from 'rxjs/operators';

import { AuthActions } from '@auth/actions';
import { UserService } from '@user/services';
import { UserActions } from '@user/actions';

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

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateRequest),
      concatMap(({ user }) =>
        this.service.update(user).pipe(
          map(user => UserActions.updateSuccess({ user })),
          catchError(() => [UserActions.updateFailure()]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: UserService) {}
}
