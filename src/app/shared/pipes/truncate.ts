import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit = 30, completeWords = false, ellipsis = '...') {
      if (completeWords) {
        limit = value.substr(0, limit).lastIndexOf(' ');
      }
      if (value) {
          return value.length > limit ? value.substr(0, limit) + ellipsis : value;
      } else {
          return null;
      }
    }
  }
