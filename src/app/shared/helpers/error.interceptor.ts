import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {from, Observable, throwError} from 'rxjs';
import {catchError, first} from 'rxjs/operators';

import { AuthService } from '../services/user/auth.service';
import {UserTokenService} from "../services/storage/user-token.service";
import {ToastService} from "../services/toast.service";
import {ErrorDisplayService} from "./error-display.service";
import {EnvironmentService} from "../services/environment/environment.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private userTokenService: UserTokenService,
        private toastService: ToastService,
        private environmentService: EnvironmentService,
        private errorDisplayService: ErrorDisplayService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err) => {
                if ([401, 403].includes(err.status)) {
                    from(this.userTokenService.getToken())
                        .pipe(first()).subscribe((token) => {
                        if (token) {
                            this.authService.logout();
                            window.location.reload();
                        }
                    });
                }

                const isApiUrl = request.url.startsWith(this.environmentService.getEnvFile().domainAPI);

                if (isApiUrl && (err.status === 500)) {
                    this.errorDisplayService.displayErrorComponent(true);
                }

                const error = err.error?.message || err.statusText;


                if (err && err.error['hydra:description']) {
                    const violations = err.error['hydra:description'];
                    const violationsSplit = violations.split("\n");

                    violationsSplit.forEach((violation: string) => {
                        const [key, message] = violation.split(": ");
                        if(message) {
                            this.toastService.presentError(message, 'top', false);
                            if (key === 'playgrounds') {
                                setTimeout(() => {
                                    window.location.reload();
                                }, 2000);
                            }
                        } else {
                            this.toastService.presentError(violation, 'top', false);
                        }
                    });
                }

                return throwError(error);
            })
        );
    }
}
