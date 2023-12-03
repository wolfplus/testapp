import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform  {
    transform(value, args) {
        let dateString = value;
        dateString = dateString.split('+')[0];
        args = args + '';
        const dateM = moment(dateString);

        return dateM.format(args);
    }
}
