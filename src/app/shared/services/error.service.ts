import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private translate: TranslateService) { }

  handleError(err: any) {

    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error('handleError error:', err);
    return throwError(errorMessage);
  }

  getMessage(errorRaw) {
    const {error} = errorRaw;
    let message = error && error['hydra:description'];
    if (!message) {
      message = error?.message ? error?.message : this.translate.instant('an_error_has_occured');
    }
    return message;
  }
}
