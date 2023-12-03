import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currency_format',
    pure: false
})
export class CurrencyFormatPipe implements PipeTransform  {
    transform(_value: string) {

        // TODO: Get the currencies.json file and assign symbol according to currency code

        return "€";
    }
}
