import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';

import { PlayerActions } from '@player/actions';
import { CoreActions } from '@core/actions';

@Injectable()
export class CoreEffects {
  invalidPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.deleteFailure),
      filter(({ error: { status } }) => status === 401),
      map(() =>
        CoreActions.showModal({
          modal: {
            header: 'Invalid PIN',
            text: 'The PIN entered is not valid for this player.',
            backdrop: {
              dismiss: true,
            },
            ok: {
              dismiss: true,
            },
          },
        }),
      ),
    ),
  );

  constructor(private readonly actions$: Actions) {}
}
