import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as AppActions from './app.actions';
import { map, tap } from 'rxjs/operators';
import { ToastService } from '../shared/services/toast.service';

@Injectable()
export class AppEffects {
    constructor(
        private actions$: Actions,
        private router: Router,
        private toast: ToastService) { }

    navigateToHomePage$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(AppActions.navigateToHomePage),
                map((_action) => {
                    return this.router.navigate(['/home']);
                })
            );
    }, { dispatch: false });

    displayToastMessage$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(AppActions.displayToastMessage),
                tap((action) => {
                    const {color, textKey, position, duration} = action;
                    this.toast.presentToast(color, textKey, position, duration);
                })
            );
    }, { dispatch: false });

    displayToastError$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(AppActions.displayToastError),
                tap((action) => {
                    const {textKey} = action;
                    this.toast.presentError(textKey);
                })
            );
    }, { dispatch: false });
}
