import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, concatMap, catchError } from 'rxjs/operators';

import { InvoiceService } from '@user/services';
import { InvoiceActions } from '@user/actions';

@Injectable()
export class InvoiceEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.getRequest),
      concatMap(({ paid }) =>
        this.service.get(paid).pipe(
          map((invoices) => InvoiceActions.getSuccess({ invoices })),
          catchError(() => [InvoiceActions.getFailure()]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: InvoiceService) {}
}
