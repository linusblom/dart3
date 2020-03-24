import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  private currency = 'SEK';

  transform(value: number) {
    return `${this.currency}${value.toFixed(2)}`;
  }
}
