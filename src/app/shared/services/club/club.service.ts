import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { HttpService } from '../http.service';
import { Club } from '../../models/club';
import { ClubPhoto } from '../../models/club-photo';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import {map, switchMap, tap} from 'rxjs/operators';
import { GeolocationService } from '../geolocation/geolocation.service';
import {Category} from "../../models/category";

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  searchTape;
  constructor(
    private httpService: HttpService,
    private store: Store<AppState>,
    private location: GeolocationService
  ) { }

  getServices() {
    return this.httpService.baseHttp('get', '/clubs/services');
  }

  getServicesClub(id) {
    return this.httpService.baseHttp('get', '/clubs/' + id + '/services', [], false);
  }

  getDiscoveries() {
    return this.httpService.baseHttp<Array<Club>>(
      'get',
      '/clubs?highlighted=true&itemsPerPage=5&page=1', /* ?highlighted=true */
      [],
      false
    );
  }

  getSubscriptionCard(iri, status, date) {
    if (status === 'active') {
      return this.httpService.baseHttp('get', iri + '?endDate[after]=' + encodeURI(date));
    } else {
      return this.httpService.baseHttp('get', iri + '?endDate[before]=' + encodeURI(date));
    }
  }

  searchClubNext(nextPage) {
    return this.httpService.baseHttp<Club[]>(
      'get',
      nextPage,
      [],
      false
    );
  }

  searchClub(limit?: number, location?: boolean, clubIds?: Array<string>): Observable<Array<Club>> {
    // let limitItems = 10;
    // if (limit) {
    //   limitItems = limit;
    // }
    let params = '';
    let useLocation;
    let distanceDefined = false;
    if (location !== undefined) {
      useLocation = location;
    } else {
      useLocation = true;
    }
    //let errorLocation = false;

    return this.store.select('validatedSearch').pipe(
      tap(search => {
        if (search !== "" && search !== 'AROUND_ME') {
          useLocation = false;
          params = '&city=' + search;
        } /* else if ( search === "") {
          return;
        } */
      }),
      switchMap(() => this.store.select('filter')),
      switchMap(data => {
        let paramsTs = '';
        if (data && data.length) {
          data.forEach(item => {
            switch (item.keyFilter) {
              case 'ACTIVITY':
                paramsTs = paramsTs + '&playground.activity.id=' + item.value;
                break;
              case 'SURFACE':
                paramsTs = paramsTs + '&playground.surface.id=' + item.value;
                break;
              case 'DISTANCE':
                paramsTs = paramsTs + '&distance=' + item.value;
                distanceDefined = true;
                break;
              case 'SORT':
                paramsTs = paramsTs + '&order[' + item.value + ']=asc';
                break;
            }
          });
        }
        if (useLocation) {
          return from(this.location.getCurrentPosition("SEARCH_CLUB")
            .then((loc: any) => {
              if (loc) {
                if (distanceDefined) {
                  paramsTs = paramsTs + '&latitude=' + loc.latitude + '&longitude=' + loc.longitude;
                } else {
                  paramsTs = paramsTs + '&latitude=' + loc.latitude + '&longitude=' + loc.longitude + '&distance=50';
                }
                paramsTs += '&order[location]=asc';
              } else {
                //errorLocation = true;
              }
              this.location.destroy();
              return paramsTs;
            })
            .catch(() => {
              // this.location.destroy();
              //errorLocation = true;
              return '&order[location]=asc';
            })
          );
        } else {
          if (paramsTs === '') {
            return of('');
          }
          return of(paramsTs);
        }
      }),
      switchMap(paramsTs => {
        if (clubIds) {
          clubIds.forEach(item => {
            params += '&id[]=/clubs/' + item;
          });
        }
        const p = limit + params + paramsTs;
        return this.httpService.baseHttp<Club[]>(
          'get',
          '/clubs?itemsPerPage=' + p,
          [],
          false
        );
      })
    );
  }

  searchClubByName(searchString, limit = 10): Observable<Array<Club>> {
    searchString = searchString.trim();
    return this.httpService.baseHttp<Array<Club>>(
      'get',
      `/clubs?search=${searchString}&limit=${limit}&order[name]=asc`,
      [],
      false
    );
  }

  searchClubCities(searchString, limit = 10): Observable<Array<string>> {
    return this.httpService.baseHttp<Array<string>>(
      'get',
      `/clubs/cities?search=${searchString}&limit=${limit}&order[name]=asc`,
      [],
      false
    );
  }

  searchClubByCity(city): Observable<Array<Club>> {
    return this.httpService.baseHttp<Array<Club>>(
      'get',
      `/clubs?city=${city}`,
      [],
      false
    );
  }

  getActivities() {
    return this.httpService.baseHttp<Array<Club>>(
      'get',
      '/activities?highlighted=true',
      [],
      false
    );
  }

  getMyClubs(userId) {
    return this.httpService.baseHttp<Array<Club>>(
      'get',
      '/user-clients/' + userId + '/preferred-clubs/',
      [],
      false
    );
  }

  getClub(clubId: string): Observable<Club> {
    return this.httpService.baseHttp<Club>('get', '/clubs/' + clubId, [], false);
  }

  get(clubUri: string): Observable<Club> {
    return this.httpService.baseHttp<Club>('get', clubUri);
  }

  getClubPhotos(iri: string): Observable<ClubPhoto[]> {
    return this.httpService.baseHttp('get', iri + '/photos');
  }

  getClubCategories(clubId): Observable<Category[]> {
    return this.httpService.baseHttp('get',
        `/clubs/playgrounds/timetables/blocks/prices/categories?club.id=${clubId}`, [], false)
      .pipe(
          map( dataMap => dataMap['hydra:member'])
      );
  }

}
