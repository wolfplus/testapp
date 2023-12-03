import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root'
})
export class SponsorsService {
    constructor(
        private httpService: HttpService
    ) { }

    getSponsors(clubId) {
        return this.httpService.baseHttp<any>('get', `/sponsors?club.id=${clubId}`, {}, false);
    }

}
