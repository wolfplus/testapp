import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'to_array',
    pure: false
})
export class ToArrayPipe implements PipeTransform  {
    transform(value) {
        if ( value < 0) {
            value = -value;
        }
        return Array(value);
    }
}
