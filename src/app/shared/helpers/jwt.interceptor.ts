import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {EnvironmentService} from "../services/environment/environment.service";
import {UserTokenService} from "../services/storage/user-token.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    env;
    constructor(private userTokenService: UserTokenService, private environmentService: EnvironmentService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.env = this.environmentService.getEnvFile();
        const isApiUrl = request.url.startsWith(this.env.domainAPI);

        return from(this.userTokenService.getToken())
            .pipe(
                switchMap(token => {
                    if (token && isApiUrl) {
                        request = request.clone({
                            setHeaders: { Authorization: `Bearer ${token}` }
                        });
                    }
                    return next.handle(request);
                })
            );

        return next.handle(request);
    }
}
