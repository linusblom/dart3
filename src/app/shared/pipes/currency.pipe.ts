import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { getAccountCurrency, State } from '@root/reducers';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  private currency = '';

  constructor(private readonly store: Store<State>) {
    this.store.pipe(select(getAccountCurrency)).subscribe(currency => (this.currency = currency));
  }

  transform(value: string) {
    return `${this.currency} ${value}`;
  }
}
