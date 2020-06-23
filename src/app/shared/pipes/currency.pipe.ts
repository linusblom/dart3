import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, shareReplay } from 'rxjs/operators';

import { getUserCurrency, State } from '@root/reducers';

@Pipe({
  name: 'currency$',
})
export class CurrencyPipe implements PipeTransform {
  private currency$ = this.store.pipe(select(getUserCurrency));

  constructor(private readonly store: Store<State>) {}

  transform(value: number | string) {
    return this.currency$.pipe(
      map(currency =>
        typeof value === 'string' || value === undefined
          ? `${currency} ${value || '0.00'}`
          : `${currency} ${value.toFixed(2)}`,
      ),
      shareReplay(1),
    );
  }
}
