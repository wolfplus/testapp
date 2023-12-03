import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hide_number_card',
    pure: false
})
export class HideNumberCard implements PipeTransform {
    transform(value: string) {
        return '****' + value.substr(value.length - 4);
    }
}
