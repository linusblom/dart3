import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { NotificationActions } from '@core/actions';
import { generateId } from '@utils/generateId';
import { map } from 'rxjs/operators';

@Injectable()
export class NotificationEffects {
  push$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.push),
      map(({ status, message }) =>
        NotificationActions.pushSuccess({
          notification: { id: generateId('notification'), status, message },
        }),
      ),
    ),
  );

  constructor(private readonly actions$: Actions) {}
}
