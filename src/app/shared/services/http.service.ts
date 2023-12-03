import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import {catchError} from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { UserTokenService } from './storage/user-token.service';
import { ToastService } from './toast.service';

import { LoaderService } from './loader/loader.service';
import { EnvironmentService } from './environment/environment.service';
import { Preferences } from '@capacitor/preferences';
import {LocaleService} from "./translate/locale.service";
import { parseJwt } from '../Tools/jwt';

type HttpRequestType = 'get' | 'post' | 'put' | 'delete';
export enum TokenTypeEnum {
  confirmation = 'x-confirmation-token',
  authorization = 'authorization'
}
export interface TokenAndType {
  token: string;
  tokenType: TokenTypeEnum;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl: string;
  private tokenKey = 'tokenAndType';
  private refreshTokenKey = 'refreshToken';
  tokenRefreshUri = '/jwt-token/refresh';
  reloaded = false;

  constructor(
    private http: HttpClient,
    private userToken: UserTokenService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private environmentService: EnvironmentService,
    private localeService: LocaleService
  ) {
    this.baseUrl = this.environmentService.getEnvFile().domainAPI;
  }

  baseHttp<T>(
    type: HttpRequestType,
    url: string,
    data?: any,
    useToken = true,
    tokenConfirm: string = null,
    contentType: string = null,
    reloaded: boolean = false,
    optConfig?: any,
  ): Observable<T | any> {
    this.reloaded = reloaded;
    const fullUrl = `${this.baseUrl}${url}`;
    const lang = this.localeService.getLocale(); //navigator?.language.split('-')[0];
    const headerConfig = { headers: new HttpHeaders() };
    headerConfig.headers = headerConfig.headers.set('X-Locale', lang);
    if (contentType) {
      headerConfig.headers = headerConfig.headers.set('Content-Type', contentType);
      headerConfig.headers = headerConfig.headers.set('Referer', 'http://localhost');
      headerConfig.headers = headerConfig.headers.set('Origin', 'http://localhost');
    }
    const config = {
      ...headerConfig,
      ...optConfig
    }
    let args = { type, fullUrl, data, config };
    if (!useToken) {
      return this.forwardRequest<T>(args).pipe(
        catchError(err => {
          return this.handlerError(err).then(bool => {
            if (bool) {
              if (!this.reloaded) {
                return this.baseHttp(type, url, data, useToken, tokenConfirm, contentType, true);
              } else {
                return err;
              }
            }
          });
        })
      );
    } else {
      if (tokenConfirm && useToken) {
        config.headers = config.headers.set('X-Confirmation-Token', tokenConfirm);
        args = { type, fullUrl, data, config };
        return this.forwardRequest<T>(args)
          .pipe(
            catchError(err => {
              return from(this.handlerError(err)
                .then(bool => {
                  if (bool) {
                    if (!this.reloaded) {
                      // return this.baseHttp(type, url, data, useToken, tokenConfirm, contentType, true);
                    }
                  }
                  throw(err);
                }));
            })
          );
      }

      return from(this.userToken.getToken()
        .then((token: string | undefined )=> {
          if (token) {
            const serializeToken = parseJwt(token);
            const now = new Date().getTime();
            if (!reloaded && parseInt('' + (now / 1000), null) >= serializeToken.exp) {
              this.userToken.getRefreshToken()
                .then(rToken => {
                  this.refreshToken(rToken)
                    .subscribe(respRefresh => {
                      if (respRefresh && respRefresh.token) {
                        this.userToken.add(respRefresh).then();

                        config.headers = config.headers.set('Authorization', 'Bearer ' + respRefresh.token);
                        args = { type, fullUrl, data, config };
                        return this.forwardRequest<T>(args)
                          .toPromise()
                          .catch(err => {
                            this.handlerError(err)
                            .then(bool => {
                              if (bool) {
                                if (!this.reloaded) {
                                  // return this.baseHttp(type, url, data, useToken, tokenConfirm, contentType, true);
                                }
                              }
                            });
                            throw(err);
                          });
                      } else {
                        return false;
                      }
                    });
                });
            } else {
              config.headers = config.headers.set('Authorization', 'Bearer ' + token);
              args = { type, fullUrl, data, config };
              return this.forwardRequest<T>(args)
                  .toPromise()
                  .catch(err => {
                    this.handlerError(err)
                        .then(bool => {
                          if (bool) {
                            if (!this.reloaded) {
                              // return this.baseHttp(type, url, data, useToken, tokenConfirm, contentType, true);
                            }
                          }
                        });
                  });
            }
          }
          return undefined;
        }).catch(err => {
          this.handlerError(err).then(bool => {
            if (bool) {
              if (!this.reloaded) {
                return this.baseHttp(type, url, data, useToken, tokenConfirm, contentType, true);
              }
            }
            return undefined;
          });
        }));
    }
  }

  handlerError(error): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      if (!error) {
        resolve(false);
      }
      if (error.status && error.status === 401) {
        /*if (!(error.url.includes(this.tokenRefreshUri) || error.url.includes('client_login_check'))) {
-          this.userToken.getRefreshToken().then(rToken => {
            this.refreshToken(rToken).subscribe(data => {
              if (data && data.token) {
                this.userToken.add(data).then();
                resolve(true);
              } else {
                resolve(false);
              }
            });

        } */
        // if (error.url.includes('client_login_check')) {
        //   this.toastService.presentError('bad_password', 'bottom');
        //   // return throwError( error);
        // }
      } else if (error.status && error.status === 400) {
        if (error.error) {
          if (error.error.errors) {
            this.toastService.presentError(error.error.errors.message, 'top');
            this.loaderService.dismiss();
          } else if (error.error.violations && error.error.violations.length > 0) {
            this.toastService.presentError(error.error.violations[0].message, 'top');
            this.loaderService.dismiss();
          } else if (error.error['hydra:description']) {
            this.toastService.presentError(error.error['hydra:description'], 'top');
          }
        }
        this.loaderService.dismiss();
      } else if (error.status && error.status === 422) {
        if (error.error) {
          if (error.error.errors) {
            this.toastService.presentError(error.error.errors.message, 'top');
            this.loaderService.dismiss();
          } else if (error.error.violations) {
            error.error.violations.forEach(item => {
              this.toastService.presentInfo(item.message, 'top');
            });
          } else if (error.error['hydra:description']) {
            this.toastService.presentError(error.error['hydra:description'], 'top');
          }
        }
        this.loaderService.dismiss();
      } else if (error.status && error.status === 500) {
        // TODO : Notification Toast error
        this.toastService.presentError('error_toast.error_500', 'top');
        this.loaderService.dismiss();
      }
      resolve(false);
    });
  }

  refreshToken(refreshToken) {
    return this.baseHttp('post', this.tokenRefreshUri, {refresh_token: refreshToken}, true, null, null, true);
  }

  forwardRequest<T>(args: { type, fullUrl, data, config }) {
    const { type, fullUrl, data, config } = args;
    let response$: Observable<T | any>;
    if (type === 'get') {
      response$ = this.http.get<T>(fullUrl, config);
    }
    else if (type === 'post') { response$ = this.http.post<T>(fullUrl, data, config); }
    else if (type === 'put') { response$ = this.http.put<T>(fullUrl, data, config); }
    else if (type === 'delete') { response$ = this.http.delete<T>(fullUrl, config); }
    return response$;
  }

  storeTokenAndType(token: string, tokenType: TokenTypeEnum, refreshToken?: string) {
    const tokenAndType: TokenAndType = { token, tokenType };
    Preferences.set({ key: this.tokenKey, value: JSON.stringify(tokenAndType) });
    if (refreshToken) {
      Preferences.set({ key: this.refreshTokenKey, value: JSON.stringify(refreshToken) });
    }
    return of(true);
  }

  extractUserIdFromToken(token: string) {
    const { userId } = jwt_decode(token);
    return userId;
  }

  getPreferencesItemByKey<T>(key, getFromCache = false): Observable<T> {
    const element = this[key];
    if (element && getFromCache) {
      return of(element);
    }
    return from(Preferences.get({ key }).then(data => {
      return JSON.parse(data.value)
    }));
  }
}
