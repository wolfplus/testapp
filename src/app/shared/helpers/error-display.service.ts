import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorDisplayService {
    private errorComponentSource = new BehaviorSubject<boolean>(false);
    errorComponent$ = this.errorComponentSource.asObservable();

    displayErrorComponent(show: boolean) {
        this.errorComponentSource.next(show);
    }
}
