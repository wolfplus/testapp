import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import {Observable, of} from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { PlaygroundOption } from '../../models/playgroung-option';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  searchTape;
  constructor(
    private httpService: HttpService  ) { }

  getClubPlaygrounds(clubId: string): Observable<any> {
    return this.httpService.baseHttp<any>('get', '/clubs/playgrounds?club.id=' + clubId, [], false);
  }

  getClubPlaygroundsWithTimeTable(clubId: string, date: string, fromTime: string, toTime: string,
                                  activityId: string, environment: string, surface: string, bookingType?: string): Observable<any> {

    let filterQuery = "";
    filterQuery += (activityId && activityId !== "") ?  `&activities.id=${ activityId }` : "";
    filterQuery += (surface && surface !== "") ? `&surface.id=${surface}` : "";

    filterQuery += (bookingType && bookingType !== "") ? `&bookingType=${bookingType}` : "";

    const filterEnvironment = (environment && environment !== "") ? `&indoor=${(environment === 'indoor')}` : "";

    if (filterQuery && filterQuery !== "") {
          return this.httpService.baseHttp<any>('get',
            // tslint:disable-next-line: max-line-length
            `/clubs/playgrounds/plannings/${date}?club.id=${clubId}&from=${fromTime}&to=${toTime}${filterQuery}${filterEnvironment}`, [], false).pipe(
        map(data => data['hydra:member']
        )
      );
    }
    if (!filterQuery || filterQuery === "") {
      return this.httpService.baseHttp<any>('get',
        `/clubs/playgrounds/plannings/${date}?club.id=${clubId}&from=${fromTime}&to=${toTime}${filterEnvironment}`, [], false).pipe(
          map(data => data['hydra:member']
          )
        );
    }

    return of(undefined);

  }

  getTimetableBlockPrice(iri: string) {
    return this.httpService.baseHttp('get', iri, [], true);
  }

  getOptions(iri: string): Observable<PlaygroundOption[]> {
    return this.httpService.baseHttp('get', iri, [], true).pipe(map(result => {
      return result ? result : of([]);
    }));
  }

  getPlayground(playgroundId: string): Observable<any> {
    return this.httpService.baseHttp<any>('get', '/clubs/playgrounds/' + playgroundId, [], false);
  }

  getClubPlaygroundTimetables(playgroundId: string, date: string): Observable<any> {
    if (date === undefined || date === '') {
      date = moment().format('');
    }
    return this.httpService.baseHttp<any>(
      'get',
      '/clubs/playgrounds/' + playgroundId + '/timetables/' + moment(date).format('YYYY-MM-DD') + '/blocks',
      [],
      false
    );
  }

  getPaymentTokenPrice(paymentTokenPriceId: string) {
    return this.httpService.baseHttp<any>(
      'get',
      `/clubs/playgrounds/timetables/blocks/prices/${paymentTokenPriceId}/payment-token-prices`,
      {},
      true
    );
  }

  getPaymentToken(paymentTokenPriceIri: string) {
    return this.httpService.baseHttp<any>('get', paymentTokenPriceIri, {}, true);
  }

  getPlaygroundByBlockId(blockId, bTypes = [], dDay = null, onlyMultiple = false) {
    let params = '';
    bTypes.forEach(item => {
      params = params + '&bookingType[]=' + item + ''
    })
    if (onlyMultiple) {
      params = params + '&bookingType=multiple'
    }
    if (dDay) {
      params = params + '&date=' + dDay;
    }

    return this.httpService.baseHttp<any>(
        'get',
        `/clubs/playgrounds?blockPrice.id[]=${blockId}${params}`,
        [],
        false
    ).pipe(
        map( dataMap => dataMap['hydra:member'])
    );
  }
}
