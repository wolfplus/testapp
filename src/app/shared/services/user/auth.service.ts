import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { User, TokensDto, UserExistDto, LoginTypesEnum } from '../../models/user';
import {Observable, of} from 'rxjs';
import { UserService } from '../storage/user.service';
import { UserTokenService } from '../storage/user-token.service';
import { AccountService } from '../account/account.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import * as UserActions from '../../../state/actions/user.actions';
import {switchMap, tap} from 'rxjs/operators';
import { EnvironmentService } from '../environment/environment.service';
import {ClubState} from "../../../club/store/club.reducers";
import {getCurrentClub} from "../../../club/store";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = '/user-clients';

    constructor(
        private httpService: HttpService,
        private userService: UserService,
        private tokenService: UserTokenService,
        private accountService: AccountService,
        private store: Store<AppState>,
        private clubStore: Store<ClubState>,
        private environmentService: EnvironmentService
    ) { }

    /* getConnectedUser(): Observable<User> {
      return this.httpService.baseHttp<User>('get', '/me');
    } */

    getConnectedUser(clubId?) {
        return this.httpService.baseHttp<User>('get', '/me')
            .pipe(
                tap(user => {
                    if (user !== undefined) {
                        this.store.dispatch(new UserActions.AddUser(user));
                    }
                }),
                switchMap(resp => {
                    if (resp === undefined || resp === null) {
                        return of(null);
                    }
                    if (this.environmentService.getEnvFile().useMb) {
                        return this.accountService.getClubsClient(
                            resp.id,
                            (clubId === null || clubId === undefined) ? this.environmentService.getEnvFile().marqueBlanche.clubIds : [clubId]
                        ).pipe(switchMap(clients => {
                                if (clients['hydra:member']) {
                                    resp.clients = clients['hydra:member'];
                                }
                                this.store.dispatch(new UserActions.AddUser(resp));
                                return of(resp);
                            }));
                    } else {
                        return this.accountService.getClients(resp.id)
                            .pipe(switchMap(clients => {
                                if (clients['hydra:member']) {
                                    resp.clients = clients['hydra:member'];
                                }
                                this.store.dispatch(new UserActions.AddUser(resp));
                                return of(resp);
                            }));
                    }
                })
            );
    }
    getConnectedClient(clubId?) {
        return this.httpService.baseHttp<User>('get', '/me')
            .pipe(
                tap(user => {
                    if (user !== undefined) {
                        this.store.dispatch(new UserActions.AddUser(user));
                    }
                }),
                switchMap(resp => {
                    if (this.environmentService.getEnvFile().useMb) {
                        return this.accountService.getClubsClient(resp.id, clubId !== undefined ? [clubId] : this.environmentService.getEnvFile().marqueBlanche.clubIds);
                    } else {
                        return this.accountService.getClients(resp.id);
                    }
                })
            );
    }

    signupUser(signupFormData: User, token: string, optConfig?: any): Observable<User> {
        return this.httpService.baseHttp<User>(
            'post',
            this.baseUrl,
            signupFormData,
            true,
            token,
            null, 
            null, 
            optConfig
        );
    }

    updateUser(userId: string, user: User) {
        return this.httpService.baseHttp<User>('put', `${this.baseUrl}/${userId}`, user);
    }

    updatePasswordUser(userId: string, user: User, xToken: string, optConfig?: any) {
        return this.httpService.baseHttp<User>('put', `${this.baseUrl}/${userId}`, user, true, xToken, null, null, optConfig);
    }

    signInUser(username: string, password: string): Observable<void | TokensDto> {
        return this.clubStore.select(getCurrentClub).pipe(switchMap(club => {
            let params: any = null;
            if (club) {
                params = {
                    username,
                    password,
                    club: club["@id"]
                };
            } else {
                params = {
                    username,
                    password,
                };
            }

            params = {...params, ...this.computeParameters()};

            return this.httpService.baseHttp<User>(
                'post',
                '/client_login_check',
                params,
                false
            );
        }));
    }

    signInUserCloack(token: string): Observable<void | TokensDto> {
        return this.httpService.baseHttp<User>(
            'post',
            '/kc_client_login_check',
            { kc_token: token },
            false
        );
    }

    computeParameters() {
        let params;
        if (this.environmentService.getEnvFile().useMb) {
            params = {
                clubWhiteLabel: "/clubs/white-labels/" + this.environmentService.getEnvFile().marqueBlanche.whiteLabelId,
                origin : "white_label_app"
            };
        } else {
            params = {
                // TODO get club id
                clubWhiteLabel: null,
                origin : "doinsport_app"
            };
        }
        return params;
    }

    checkIfUserExists(email: string | null, phoneNumber: string | null = null): Observable<UserExistDto> {
        let check = {};
        if(email) {
            check = { identifier: email }
        } else if(phoneNumber) {
            check = { phoneNumber }
        }
        return this.httpService.baseHttp<UserExistDto>(
            'post',
            '/user-exists',
            { ...check },
            false
        );
    }

    checkPassword(password: string) {
        return this.httpService.baseHttp<User>('post', `/check-credential`, {password});
    }

    getPhoneNumberValidationCode(phone: string): Observable<any> {
        const data = { phoneNumber: phone, whiteLabel: null };
        if (this.environmentService.getEnvFile().useMb && this.environmentService.getEnvFile().marqueBlanche.whiteLabelId) {
            data.whiteLabel = '/clubs/white-labels/' + this.environmentService.getEnvFile().marqueBlanche.whiteLabelId;
        } else {
            // TODO get club id
        }
        return this.httpService.baseHttp<any>('post', '/validation-intents', data, false);
    }

    getEmailValidationCode(email: string): Observable<any> {
        const data = { whiteLabel: null,  email: email};
        if (this.environmentService.getEnvFile().useMb && this.environmentService.getEnvFile().marqueBlanche.whiteLabelId) {
            data.whiteLabel = '/clubs/white-labels/' + this.environmentService.getEnvFile().marqueBlanche.whiteLabelId;
        } else {
            // TODO get club id
        }
        return this.httpService.baseHttp<any>('post', '/validation-intents', data, false);
    }

    getEmailValidationIntent(email: string, phone: string | null): Observable<void> {
        const data = { whiteLabel: null,  email: email };
        if(phone) {
            data['phoneNumber'] = phone;
        }
        if (this.environmentService.getEnvFile().useMb && this.environmentService.getEnvFile().marqueBlanche.whiteLabelId) {
            data.whiteLabel = '/clubs/white-labels/' + this.environmentService.getEnvFile().marqueBlanche.whiteLabelId;
        } else {
            // TODO get club id
        }
        return this.httpService.baseHttp<any>('post', '/validation-intents', data, false);
    }

    userExist(email: string) {
        return this.httpService.baseHttp<any>('post', '/user-exists', { identifier: email }, false);
    }

    verifyEmailValidationCode(email: string, validationCode: string | number)
        : Observable<{token: string, refresh_token: string}|any> {

        return this.httpService.baseHttp<{token: string, refresh_token: string}|any>(
            'post',
            '/validation-check',
            { email, validationCode },
            false
        );
    }

    verifyPhoneNumberValidationCode(phoneNumber: string, validationCode: string | number)
        : Observable<{token: string, refresh_token: string}|any> {

        return this.httpService.baseHttp<{token: string, refresh_token: string}|any>(
            'post',
            '/phone-number-validation-check',
            { phoneNumber, validationCode },
            false
        );
    }

    addUserNotificationPlayerid(params) {
        // reference
        // return this.httpService.baseHttp<any>('post', '/user-clients/push-notification-configurations', params, true);

        if (this.environmentService.getEnvFile().useMb && this.environmentService.getEnvFile().marqueBlanche.whiteLabelId) {
            params.clubWhiteLabel = '/clubs/white-labels/' +  this.environmentService.getEnvFile().marqueBlanche.whiteLabelId;
        } else {
            // TODO get club id
        }
        return this.httpService.baseHttp<any>('post', '/user-clients/one-signal-players', params, true);
    }

    getLoginType() {
        return LoginTypesEnum.CLIENT;
    }

    logout() {
        this.userService.delete();
        this.tokenService.delete();
    }
}
