import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '0,00';
    const [int, dec] = value.toFixed(2).split('.');
    const thousands = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${thousands},${dec}`;
  }
}
