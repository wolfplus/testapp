import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { UserService } from '../storage/user.service';
import { Observable } from 'rxjs';
import { Avatar } from '../../models/avatar';
import { UntypedFormGroup } from '@angular/forms';
import { filter, map, tap } from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';

import {EnvironmentService} from "../environment/environment.service";
import {getCurrentClub} from "../../../club/store";
import {Club} from "../../models/club";
import { AccessCode } from '../../models/user-client';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    form: UntypedFormGroup;

    private currentClub: Club;

    constructor(
        private httpService: HttpService,
        private userService: UserService,
        private environmentService: EnvironmentService,
        private store: Store<AppState>
    ) {
        this.store.pipe(select(getCurrentClub)).subscribe(currentClub => {
            this.currentClub = currentClub;
        });
    }

    // getDataUserClient(userId) {
    //     return this.httpService.baseHttp('get', `/user-clients/' + userId + '/stats`);
    // }

    getCreditPriceInfo(cartId: any, clientId: any) {
        return this.httpService.baseHttp('get', `/payments/carts/${cartId}/amount-as-payment-token/${clientId}`, [], true);
    }

    getDataUserClient(userId) {
        let params;
        if (this.environmentService.getEnvFile().marqueBlanche.whiteLabelId) {
            params = `club.whiteLabel.id=${this.environmentService.getEnvFile().marqueBlanche.whiteLabelId}`;
        } else {
            params = `club.id[]=${this.currentClub.id}`;
        }
        params = params + `&country=${this.currentClub.country}`;

        return this.httpService.baseHttp('get', `/user-clients/${userId}/stats.json?${params}`);
    }

    getSuscriptionPlan(iri) {
        return this.httpService.baseHttp('get', iri);
    }

    getSuscriptionCards(iri) {
        return this.httpService.baseHttp('get', iri);
    }

    getWalletId(id: string) {
        return this.httpService.baseHttp('get', `/clubs/clients/wallets/${id}`, [], true);
    }

    getWallet(iri: string) {
        return this.httpService.baseHttp('get', iri, [], true);
    }

    getWallets() {
        return this.httpService.baseHttp('get', '/clubs/clients/wallets', [], true);
    }

    getWalletByClubId(id: string) {
        return this.httpService.baseHttp('get', `/clubs/clients/wallets?club.id[]=${id}`, [], true);
    }

    getWalletDetails(clientId?, nextPage?) {
        if (!nextPage) {
            return this.httpService.baseHttp('get', `/clubs/clients/wallets/operations?client.id=${clientId}&page=1`, [], true);
        } else {
            return this.httpService.baseHttp('get', nextPage, [], true);
        }
    }

    getClientCredits(id: string) {
        return this.httpService.baseHttp('get', '/clubs/clients/payment-tokens?balance[gt]=0&client.id=' + id, [], true);
    }

    getClientCreditDetail(creditId?, nextPage?) {
        if (!nextPage) {
            return this.httpService.baseHttp('get', '/clubs/clients/payment-tokens/operations?paymentToken.id=' + creditId, [], true);
        } else {
            return this.httpService.baseHttp('get', nextPage, [], true);
        }
    }

    getClient(client) {
        return this.httpService.baseHttp('get', client);
    }

    getConsumption(whiteLabelId: string) {
        if (whiteLabelId) {
            return this.httpService.baseHttp('get', `/nextore/sales?whiteLabel.id=${whiteLabelId}`, [], true);
        } else {
            return this.httpService.baseHttp('get', `/nextore/sales?club.id=${whiteLabelId}`, [], true);
        }
    }

    getConsumptionNextPage(nextPage) {
        return this.httpService.baseHttp('get', `${nextPage}`, [], true);
    }

    getConsumptionDetails(saleId) {
        return this.httpService.baseHttp('get', `/nextore/sales/${saleId}`, [], true);
    }

    getClients(id) {
        let params = '';
        if (this.environmentService.getEnvFile().useMb) {
            this.environmentService.getEnvFile().marqueBlanche.clubIds.forEach(item => {
                params += '&club.id=' + item;
            });
        }
        return this.httpService.baseHttp('get', '/clubs/clients?user-client=' + id + params)
            .pipe(
                filter( data => data !== undefined),
                filter( data => data['hydra:member'].length > 0),
                tap( data => {
                    const clientsClubs = [];
                    data['hydra:member'].forEach(item => {
                        clientsClubs.push({
                            client: item['@id'],
                            club: item.club,
                            clientInfo: item
                        });
                    });
                    this.userService.addClients(clientsClubs);
                })
            );
    }

    /* getClients(id) {
        return this.httpService.baseHttp('get', '/clubs/clients?user-client=' + id)
            .subscribe(data => {
                if (data['hydra:member'].length > 0) {
                    const clientsClubs = [];
                    data['hydra:member'].forEach(item => {
                        clientsClubs.push({
                            client: item['@id'],
                            club: item.club,
                        });
                    });
                    this.userService.addClients(clientsClubs).then();
                }
                return of(data);
            });
    } */

    getClientClub(userId: string, clubId: string) {
        return this.httpService.baseHttp('get', '/clubs/clients?user.id=' + userId + '&club.id=' + clubId);
    }

    getClubsClient(userId: string, clubIds: Array<string>) {
        let params = `?user-client=${userId}`;
        if (clubIds && clubIds.length) {
            clubIds.forEach( id => {
                params += `&club.id[]=${id}`;
            });
        }
        return this.httpService.baseHttp('get', `/clubs/clients${params}`)
            .pipe(
                tap( data => {
                    if (data !== undefined) {
                        const clientsClubs = [];
                        data['hydra:member'].forEach(item => {
                            clientsClubs.push({
                                client: item['@id'],
                                club: item.club
                            });
                        });
                        this.userService.addClients(clientsClubs);
                    }
                })
            );
    }

    getMyClients(id) {
        return this.httpService.baseHttp('get', '/clubs/clients?user-client=' + id);
    }

    getMyClientsByClubId(id, clubId) {
        return this.httpService.baseHttp('get', '/clubs/clients?user-client=' + id + '&club.id[]=' + clubId);
    }

    updateUser(data, id) {
        return this.httpService.baseHttp('put', `/user-clients/${id}`, data, true);
    }

    getAvatar(uri: string): Observable<Avatar> {
        return this.httpService.baseHttp('get', uri);
    }

    genarateAccessCode(userId: string, clubId: string): Observable<string> {
        return this.httpService.baseHttp<AccessCode>('get', `/user-clients/${userId}/clubs/${clubId}/access-code`).pipe(
            map((data: AccessCode) => data.accessCode)
        );
    }

    sendAvatar(blobData: any, name: string, ext: string, userIRI: string) {
        const formData = new FormData();
        formData.append("user", userIRI);
        formData.append('file', blobData, `myimage.${ext}`);
        formData.append('name', name);

        return this.httpService.baseHttp('post', '/user-clients/avatars', formData, true);
    }

    deleteAvatar(avatarIRI) {
        return this.httpService.baseHttp('delete', `${avatarIRI}`, {}, true);
    }
}
