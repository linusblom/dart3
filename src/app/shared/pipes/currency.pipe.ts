import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  private currency = 'SEK';

  transform(value: number | string) {
    return typeof value === 'string' || value === undefined
      ? `${this.currency}${value || '0.00'}`
      : `${this.currency}${value.toFixed(2)}`;
  }
}
