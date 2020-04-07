import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { getUserCurrency, State } from '@root/reducers';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  private currency = '';

  constructor(private readonly store: Store<State>) {
    this.store.pipe(select(getUserCurrency)).subscribe(currency => (this.currency = currency));
  }

  transform(value: number | string) {
    return typeof value === 'string' || value === undefined
      ? `${this.currency}${value || '0.00'}`
      : `${this.currency}${value.toFixed(2)}`;
  }
}
