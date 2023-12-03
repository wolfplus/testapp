import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import { FilterKey } from '../shared/models/filter';
import { HttpService } from '../shared/services/http.service';
import { ClubMatch } from './match.model';
import * as moment from 'moment-timezone';
import {filter, map, tap} from 'rxjs/operators';
import { Period } from '../shared/enums/period';
import { EnvironmentService } from '../shared/services/environment/environment.service';
import { ClubIdStorageService } from '../shared/services/clud-id-storage/club-id-storage.service';
import {getCurrentClubId} from "../club/store";
import {ClubState} from "../club/store/club.reducers";

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  counter = 0;
  params:string = '';

  currentClubId$: any;
  currentClubId: any;

  constructor(
      private httpService: HttpService,
      private environmentService: EnvironmentService,
      private clubIdStorageService: ClubIdStorageService,
      private clubStore: Store<ClubState>
  ) {
    this.currentClubId$ = this.clubStore.pipe(
        select(getCurrentClubId),
        tap(clubId => {
          this.currentClubId = clubId;
        })
    ).subscribe();
  }

  getParams() {
    return this.clubIdStorageService.getClubId().then(data => data);
  }

  createMatch(matchData): Observable<ClubMatch> {
    return this.httpService.baseHttp<ClubMatch>('post', '/clubs/matches', matchData, true);
  }

  get(iri): Observable<ClubMatch> {
    return this.httpService.baseHttp<ClubMatch>('get', iri);
  }

  getMatch(matchId): Observable<ClubMatch> {
    return this.httpService.baseHttp<any>('get', `/clubs/matches/${matchId}`)
        .pipe(
            filter( data => data !== undefined),
            map( (match) => {
              match['startAt'] = moment(match.startAt).tz(match.club.timezone).format();
              match['endAt'] = moment(match.endAt).tz(match.club.timezone).format();
              match['participants'] = match['participants'].filter( participant => participant.canceled === false);
              return match;
            }),
        );
  }

  // getMatchesClub(id: string) {
  //   const now = moment();
  //   const paramAfterNow = '&endAt[strictly_after]=' + now.format('YYYY-MM-DD HH:mm:ss');
  //   //const start  = date + ' 00:00:00';
  //   //const end  = date + ' 23:59:59';
  //   return this.httpService.baseHttp<ClubMatch>('get', `/clubs/matches?club.id=${id}&canceled=false${paramAfterNow}`, {}, false)
  //       .pipe(
  //           filter( data => data !== undefined),
  //           map( (matches) => {
  //             matches['hydra:member'].map( match => {
  //               match['startAt'] = moment(match.startAt).tz(match.club.timezone).format();
  //               match['endAt'] = moment(match.endAt).tz(match.club.timezone).format();
  //               match['participants'] = match['participants'].filter( participant => participant.canceled === false);
  //               return match;
  //             });
  //             // bookings['hydra:member'] = timeFormattedBookings;
  //             return matches;
  //           })
  //       );
  // }

  /* getMatchesMyMatches(canceled, status, limit = null, id) {
    if (limit !== null) {
      return this.httpService.baseHttp<ClubMatch>('get', `/clubs/matches?userClient.id=${id}&itemsPerPage=${limit}`);
    } else {
      return this.httpService.baseHttp<ClubMatch>('get', `/clubs/matches?userClient.id=${id}`);
    }
  } */

  getMyMatchesNextPage(nextPage) {
    return this.httpService.baseHttp<ClubMatch[]>('get', `${nextPage}`, {}, false)
        .pipe(
            filter( data => data !== undefined),
            map( (matches) => {
              matches['hydra:member'].map( match => {
                match['startAt'] = moment(match.startAt).tz(match.club.timezone).format();
                match['endAt'] = moment(match.endAt).tz(match.club.timezone).format();
                match['participants'] = match['participants'].filter( participant => participant.canceled === false);
                return match;
              });
              // bookings['hydra:member'] = timeFormattedBookings;
              return matches;
            })
        );
  }

  getMyMatches(userId: string, canceled: boolean, period?: Period, limit = null, changed?){
    let params = "";
    let itemsPerPage = 10;

    if (limit !== null) {
      itemsPerPage = limit;
    }

    if (canceled === true) {
      params += '?canceled=true&order[startAt]=DESC';
    } else {
      params += '?canceled=false';
      if (period) {
        const dateNow = new Date().toISOString();
        switch (period) {
          case Period.NEXT:
            params += `&startAt[after]=${dateNow}&order[startAt]=ASC`;
            break;
          case Period.PAST:
            params += `&startAt[strictly_before]=${dateNow}&order[startAt]=DESC`;
            break;
          default:
            params += "";
            break;
        }
      }
    }

    if (this.environmentService.getEnvFile().useMb) {
      if(changed) {
        this.params = '&club.id[]=' + changed;
        params +=this.params;
      } else {
        this.environmentService.getEnvFile().marqueBlanche.clubIds.forEach(id => {
          params += '&club.id[]=' + id;
        })
      }
    }

    return this.httpService.baseHttp<ClubMatch[]>(
        'get',
        `/clubs/matches${params}&userClient.id=${userId}&itemsPerPage=${itemsPerPage}`,
        {}, true
    )
        .pipe(
            filter( data => data !== undefined),
            map( (matches) => {
              matches['hydra:member'].map( match => {
                match['startAt'] = moment(match.startAt).tz(match.club.timezone).format();
                match['endAt'] = moment(match.endAt).tz(match.club.timezone).format();
                match['participants'] = match['participants'].filter( participant => participant.canceled === false);
                return match;
              });
              // bookings['hydra:member'] = timeFormattedBookings;
              return matches;
            })
        );
  }

  getMatches(parameters?, clubMatches = false, changed?, stored?): Observable<ClubMatch[]> {
    this.counter += 1;
    if (parameters.nextPage) {
      return this.httpService.baseHttp<ClubMatch[]>('get', `${parameters.nextPage}`, {}, false);
    } else {
      let params = '';
      let distanceDefined = false;
      let latitude;
      let longitude;

      console.log(parameters, clubMatches, changed, stored, "<=== parameters")

      if (parameters.selectedDate !== undefined) {
        let startDate;
        let endDate;
        startDate = parameters.selectedDate;
        if (startDate.format('YYYYMMDD') === moment().format('YYYYMMDD')) {
          startDate = moment();
        } else {
          startDate.set({hour: 0, minute: 0, second: 0, millisecond: 0});
        }
        const inverseOffsetStart = moment(startDate).tz(parameters.clubTimeZone).utcOffset() * -1;
        startDate = moment(startDate).utcOffset(inverseOffsetStart);
        if (clubMatches === false) {
          endDate = parameters.selectedDate;
          endDate.set({hour: 23, minute: 59, second: 59, millisecond: 0});
          const inverseOffsetEnd = moment(endDate).tz(parameters.clubTimeZone).utcOffset() * -1;
          endDate = moment(endDate).utcOffset(inverseOffsetEnd);
          params += `&startAt[after]=${startDate.format('YYYY-MM-DD[T]HH:mm:ss')}&endAt[before]=${endDate.format('YYYY-MM-DD[T]HH:mm:ss')}`;
        } else {
          params += `&endAt[after]=${startDate.format('YYYY-MM-DD[T]HH:mm:ss')}`;
        }
      }
      if (parameters.clubIds !== undefined && parameters.clubIds !== null) {

        if (this.environmentService.overwriteMatchEvent()) {
          if (this.environmentService.getEnvFile().useMb) {
            if(changed) {
              this.params = '&club.id[]=/clubs/' + changed;
            } else {
              if(stored) {
                this.params = '&club.id[]=/clubs/' + (this.currentClubId ? this.currentClubId : this.environmentService.getEnvFile().marqueBlanche.clubIds[0]);

              } else{

                if (parameters.clubIds !== undefined && parameters.clubIds !== null) {
                  parameters.clubIds.forEach(item => {
                    params += `&club.id[]=/clubs/${item}`;
                  });
                }
              }

            }
            params += this.params;
          }
          if (parameters.clubTimeZone) {
            const inverseOffset = moment().tz(parameters.clubTimeZone).utcOffset() * -1;
            const date = moment().utcOffset(inverseOffset);
            params += `&endAt[strictly_after]=${date.format('YYYY-MM-DD[T]HH:mm:ss')}`;
          } else {
            params += `&endAt[strictly_after]=${moment().format('YYYY-MM-DD[T]HH:mm:ss')}&startAt[strictly_before]=${moment().format('YYYY-MM-DD[T]HH:mm:ss')}`;
          }
        } else {

          if (this.environmentService.getEnvFile().useMb) {
            if (changed) {
              this.params = '&club.id[]=/clubs/' + changed;
            } else {
              if (stored) {
                this.params = '&club.id[]=/clubs/' + (this.currentClubId ? this.currentClubId : this.environmentService.getEnvFile().marqueBlanche.clubIds[0]);
              } else{
                if (parameters.clubIds !== undefined && parameters.clubIds !== null) {
                  parameters.clubIds.forEach(item => {
                    params += `&club.id[]=/clubs/${item}`;
                  });
                }
              }
            }
            params +=this.params;
          }
          if (!parameters.clubTimeZone) {
            params += `&startAt[strictly_after]=${moment().format('YYYY-MM-DD[T]HH:mm:ss')}&startAt[strictly_before]=${moment().format('YYYY-MM-DD[T]HH:mm:ss')}`;
          }
        }
      } else if (parameters.clubId === undefined) {
        if ( parameters.searchTerm !== "" && parameters.searchTerm !== undefined ) {
          if (parameters.searchTerm !== "AROUND_ME") {
            params += `&club.city=${parameters.searchTerm}`;
          } else {
            if (parameters.userPosition !== undefined) {
              latitude = parameters.userPosition.latitude;
              longitude = parameters.userPosition.longitude;
              params += `&latitude=${latitude}&longitude=${longitude}&order[location]=asc`;
            }
          }
        }
      } else {
        if (this.environmentService.getEnvFile().useMb) {
          if(changed) {
            this.params = '&club.id[]=' + changed;
          }
          params +=this.params;
        }
      }

      if (parameters.searchFilters !== undefined && parameters.searchFilters.length > 0) {
        parameters.searchFilters.forEach(item => {
          switch (item.keyFilter) {
            case FilterKey.ACTIVITY:
              params = params + '&activity.id=' + item.value;
              break;
            case FilterKey.SURFACE:
              params = params + '&playground.surface.id=' + item.value;
              break;
            case FilterKey.DISTANCE:
              params = params + '&distance=' + item.value;
              distanceDefined = true;
              break;
            case FilterKey.SORT:
              params = params + '&order[' + item.value + ']=asc';
              break;
            case FilterKey.ENVIRONMENT:
              if (item.value === 'indoor') {
                params = params + '&playground.indoor=true';
              } else if (item.value === 'outdoor') {
                params = params + '&playground.indoor=false';
              }
              break;
              /* case 'LATITUDE':
                params = params + 'latitude=' + item.value + '&';
                break;
              case 'LONGITUDE':
                params = params + 'longitude=' + item.value + '&';
                break; */
          }
        });
      }
      if (distanceDefined === false) {
        params += '&distance=20';
      }
      params += '&order[startAt]=asc';
      return this.httpService.baseHttp<ClubMatch[]>(
          'get',
          `/clubs/matches?itemsPerPage=5&page=1&canceled=false${params}`,
          {},
          false)
          .pipe(
              filter( data => data !== undefined),
              map( (matches) => {
                matches['hydra:member'].map( match => {
                  match['startAt'] = moment(match.startAt).tz(match.club.timezone).format();
                  match['endAt'] = moment(match.endAt).tz(match.club.timezone).format();
                  match['participants'] = match['participants'].filter( participant => participant.canceled === false);
                  return match;
                });
                // bookings['hydra:member'] = timeFormattedBookings;
                return matches;
              })
          );
    }
  }

  /* : Observable<Update<ClubMatch>> */
  updateMatch(_match): Observable<Update<ClubMatch>> {
    return of(
        null
    );
  }

  deleteMatch(matchId): Observable<any> {
    return this.httpService.baseHttp<ClubMatch>('put', `/clubs/matches/${matchId}`, {canceled: true}, true, );
  }

  addParticipants(participantsData): Observable<any> {
    // TODO: add type for participant data
    return this.httpService.baseHttp<any>('post', '/clubs/matches/participants', participantsData, true);
  }

  deleteParticipation(userParticipantIRI): Observable<any> {
    // TODO: add type for participant data
    return this.httpService.baseHttp<any>('put', `${userParticipantIRI}`, { canceled: true }, true );
  }

  updateParticipants(userParticipantIRI, participantsData): Observable<any> {
    // TODO: add type for participant data
    return this.httpService.baseHttp<any>('put', `${userParticipantIRI}`, participantsData, true );
  }

  inviteFriend(matchIRI, userID) {
    return this.httpService.baseHttp<any>('post', '/clubs/matches/guests', {match: matchIRI, userClient: userID}, true);
  }

  getMatchGuests(matchIRI) {
    return this.httpService.baseHttp<Array<any>>('get', `${matchIRI}/guests`);
  }

}
