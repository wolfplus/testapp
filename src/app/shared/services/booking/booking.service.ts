import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Club } from '../../models/club';
import { Booking, PaymentMethods } from '../../models/booking';
import { Observable } from 'rxjs';
import { AttenderBooking } from '../../models/attender-booking';
import { Period } from '../../enums/period';
import * as moment from 'moment';

import { filter, map } from 'rxjs/operators';
import { EnvironmentService } from '../environment/environment.service';
import { ClubIdStorageService } from '../clud-id-storage/club-id-storage.service';
import {select, Store} from "@ngrx/store";
import {ClubState} from "../../../club/store/club.reducers";
import {getCurrentClubId} from "../../../club/store";


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  params = '';
  env: any;
  whiteLabelId = '';
  currentClubId$: any;
  currentClub = '';

  constructor(
    private httpService: HttpService,
    private environmentService: EnvironmentService,
    private clubIdStorageService: ClubIdStorageService,
    private clubStore: Store<ClubState>
  ) {
    this.getParams();
    this.env = this.environmentService.getEnvFile();
    this.whiteLabelId = this.env.marqueBlanche.whiteLabelId;
    this.currentClubId$ = this.clubStore.pipe(
        select(getCurrentClubId)
    );
   }

   getParams() {
    this.clubIdStorageService.getClubId().then(data =>  {
      this.params = '&club.id[]=' + data;
    });
   }

  get(iri) {
    return this.httpService.baseHttp('get', iri);
  }

  delete(booking: Booking) {
    return this.httpService.baseHttp('put', booking['@id'], {canceled: true}, true);
  }
  deleteAttender(participant: AttenderBooking) {
    participant.canceled = true;
    return this.httpService.baseHttp('put', participant['@id'], {canceled: true}, true);
  }
  getBooking(id) {
    return this.httpService.baseHttp('get', '/clubs/bookings/' + id);
  }
  getPlaygroundBookings(playgroundId) {
    return this.httpService.baseHttp('get', `/clubs/bookings?playgrounds.id=${playgroundId}`);
  }
  getPlaygroundPlanningBookings(playgroundId, startAt, endAt) {
    return this.httpService.baseHttp(
        'get',
        `/clubs/bookings/plannings?playgrounds.id=${playgroundId}&startAt[after]=${startAt}&startAt[before]=${endAt}`,
        null,
        false
    );
  }

  getBookingParticipants(bookingId, userId, isClient?) {
    if (isClient) {
      return this.httpService.baseHttp('get', `/clubs/bookings/participants?booking.id=${bookingId}&canceled=false&client.id=${userId}`);
    } else {
      return this.httpService.baseHttp('get', `/clubs/bookings/participants?booking.id=${bookingId}&canceled=false&user.id=${userId}`);
    }
  }

  // getBookingComfirmedParticipants(bookingId, userId, isClient?) {
  //   if (isClient) {
  //     return this.httpService.baseHttp('get', `/clubs/bookings/participants?booking.id=${bookingId}&canceled=false&client.id=${userId}&confirmed=true`);
  //   } else {
  //     return this.httpService.baseHttp('get', `/clubs/bookings/participants?booking.id=${bookingId}&canceled=false&user.id=${userId}&confirmed=true`);
  //   }
  // }

  getBookingParticipantsFull(bookingId) {
    return this.httpService.baseHttp('get', `/clubs/bookings/participants?booking.id=${bookingId}&canceled=false`);
  }

  getIconPraticipants(bookingId) {
    return this.httpService.baseHttp('get', `/clubs/bookings/participants?booking.id=${bookingId}&canceled=false&itemsPerPage=5`);
  }

  getMyBooking(bookingIRI) {
    return this.httpService.baseHttp<Booking>('get', `${bookingIRI}`);
  }

  addBookingParticipant(data: any) {
    return this.httpService.baseHttp<any>('post', '/clubs/bookings/participants', data, true);
  }

  removeBookingParticipant(data: any) {
    return this.httpService.baseHttp<any>('put', `/clubs/bookings/participants/${data.id}`, { canceled: true });
  }

  getCourses(date, clubId, activity?, categoryId = null, event?, itemsPerPage?) {
    let url = '';
    if (activity) {
      url = `/clubs/bookings?activityType=lesson&startAt[after]=${date}T00:00:00&startAt[before]=${date}T23:59:59&club.id=${clubId}&activity.id=${activity.id}`;
    } else {
      url = `/clubs/bookings?activityType=lesson&startAt[after]=${date}T00:00:00&startAt[before]=${date}T23:59:59&club.id=${clubId}`;
    }

    if(event) {
      url = `/clubs/bookings?activityType=event&startAt[after]=${date}T00:00:00&order[createdAt]=asc&club.id=${clubId}&itemsPerPage=${itemsPerPage}`;
    }

    if (categoryId) {
      url = url + '&timetableBlockPrice.category.id=' + categoryId
    }

    return this.httpService.baseHttp(
      'get',
        url,
      [],
      false
    ).pipe(
      filter( data => data !== undefined),
      map((bookings) => {
        bookings['hydra:member'].map( booking => {
          booking['startAt'] = moment(booking.startAt).tz(booking.club.timezone).format();
          booking['endAt'] = moment(booking.endAt).tz(booking.club.timezone).format();
          return booking;
        });

        return bookings['hydra:member'];
      }
      )
    );
  }

  getActivities(clubId) {
    return this.httpService.baseHttp(
      'get',
      `/activities?club.id=${clubId}&type=lesson`,
      [],
      false
    ).pipe(
      filter( data => data !== undefined),
      map((activities) => {
        return activities['hydra:member'];
      }
      )
    );
  }


  getMyBookingsNextPage(nextPage: any): Observable<Booking[]> {
    return this.httpService.baseHttp<Booking[]>('get', `${nextPage}`, true)
    .pipe(
      filter( data => data !== undefined),
      map( (bookings) => {
        bookings['hydra:member'].map( booking => {
          booking['startAt'] = moment(booking.startAt).tz(booking.club.timezone).format();
          booking['endAt'] = moment(booking.endAt).tz(booking.club.timezone).format();
          return booking;
        });
        // bookings['hydra:member'] = timeFormattedBookings;
        return bookings;
      })
    );
  }

  getMyCoursessNextPage(nextPage: any): Observable<Booking[]> {
    return this.httpService.baseHttp<Booking[]>('get', `${nextPage}`, true)
    .pipe(
      filter( data => data !== undefined),
      map( (bookings) => {
        bookings['hydra:member'].map( booking => {
          booking['startAt'] = moment(booking.startAt).tz(booking.club.timezone).format();
          booking['endAt'] = moment(booking.endAt).tz(booking.club.timezone).format();
          return booking;
        });
        // bookings['hydra:member'] = timeFormattedBookings;
        return bookings;
      })
    );
  }

  getMyMatchableBookings(_userId: string) {
    this.getParams();
    const dateNow = new Date().toISOString();
    const itemsPerPage = 10;
    let paramCompl = '';
    // const env = this.environmentService.getEnvFile();

    if (this.environmentService.getEnvFile().useMb) {
      paramCompl += this.params;
    }

    return this.httpService.baseHttp<Booking[]>(
      'get',
      `/clubs/bookings?activityType=sport&confirmed=true&canceled=false&exists[validatedAt]=true&startAt[after]=${dateNow}&itemsPerPage=${itemsPerPage}&page=1&order[startAt]=ASC${paramCompl}`,
      true
    )
    .pipe(
      filter( data => data !== undefined),
      map( (bookings) => {
        bookings['hydra:member'].map( booking => {
          booking['startAt'] = moment(booking.startAt).tz(booking.club.timezone).format();
          booking['endAt'] = moment(booking.endAt).tz(booking.club.timezone).format();

          booking.participants.map((participant, index) => {
            if (participant.canceled) {
              booking.participants.splice(index, 1);
            }
          });
          return booking;
        });
        // bookings['hydra:member'] = timeFormattedBookings;
        return bookings;
      })
    );
  }

  getMyBookings2(canceled, period?: Period, limit = null, _changed?, userId?): Observable<Booking[]> {
    let params = '';
    let itemsPerPage = 10;

    if (limit !== null) {
        itemsPerPage = limit;
      }

    if (canceled === true) {
        params += `?participants.user.id=${userId}&activityType=lesson&canceled=true&order[startAt]=DESC`;
      } else {
        params += `?participants.user.id=${userId}&activityType=lesson&canceled=false`;
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

    // if (this.environmentService.getEnvFile().useMb) {
    //     if (changed) {
    //       this.params = '&club.id[]=' + changed;
    //       params += this.params;
    //     } else {
    //       this.environmentService.getEnvFile().marqueBlanche.clubIds.forEach(id => {
    //         params += '&club.id[]=' + id;
    //       });
    //     }

    //   }

      // TODO: delete after tests TO TEST ERROR DISPLAY
      // return throwError("ERROR");


    return this.httpService.baseHttp<Booking[]>('get', `/clubs/bookings${params}&whiteLabel.id=${this.whiteLabelId}&itemsPerPage=${itemsPerPage}&page=1&confirmed=true`, true)
        .pipe(
            filter( data => data !== undefined),
            map( (bookings) => {
              bookings['hydra:member'].map( booking => {
                booking['startAt'] = moment(booking.startAt).tz(booking.club.timezone).format();
                booking['endAt'] = moment(booking.endAt).tz(booking.club.timezone).format();
                return booking;
              });
              // bookings['hydra:member'] = timeFormattedBookings;
              return bookings;
            })
        );
  }

  getMyBookings(club, canceled, period?: Period, limit = null, _changed?, userId?, order = "DESC", byClub?): Observable<Booking[]> {
    let params = '';
    let itemsPerPage = 10;

    if (limit !== null) {
        itemsPerPage = limit;
      }

    if (canceled === true) {
        params += '?activityType[]=sport&activityType[]=lesson&activityType[]=event&activityType[]=leisure&activityType[]=formula&canceled=true&order[startAt]=DESC';
      } else {
        params += '?activityType[]=sport&activityType[]=lesson&activityType[]=event&activityType[]=leisure&activityType[]=formula&canceled=false';
        if (period) {
          const inverseOffset = moment().tz(club.timezone).utcOffset() * -1;
          let timestamp = moment().utcOffset(inverseOffset );

          const dateNow = timestamp.format('YYYY-MM-DD[T]HH:mm:ss');
          switch (period) {
            case Period.NEXT:
              params += `&startAt[after]=${dateNow}&order[startAt]=${order}`;
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

    // if (this.environmentService.getEnvFile().useMb) {
    //     if (changed) {
    //       this.params = '&club.id[]=' + changed;
    //       params += this.params;
    //     } else {
    //       this.environmentService.getEnvFile().marqueBlanche.clubIds.forEach(id => {
    //         params += '&club.id[]=' + id;
    //       });
    //     }

    //   }

    if (this.whiteLabelId && !byClub) {
      params += `&whiteLabel.id=${this.whiteLabelId}`;
    } else if (byClub) {
      params += `&club.id[]=${club.id}`;
    } else {
      this.currentClubId$.subscribe(clubId => {
        params += `&club.id[]=${clubId}`;
      });
    }

    if (userId) {
      params += `&participants.user.id=${userId}`;
    }

      // TODO: delete after tests TO TEST ERROR DISPLAY
      // return throwError("ERROR");
    return this.httpService.baseHttp<Booking[]>('get', `/clubs/bookings${params}&itemsPerPage=${itemsPerPage}&page=1&confirmed=true`, true)
        .pipe(
            filter( data => data !== undefined),
            map( (bookings) => {
              bookings['hydra:member'].map( booking => {
                booking['startAt'] = moment(booking.startAt).tz(booking.club.timezone).format();
                booking['endAt'] = moment(booking.endAt).tz(booking.club.timezone).format();
                return booking;
              });
              // bookings['hydra:member'] = timeFormattedBookings;
              return bookings;
            })
        );
  }



  getMyCourses(canceled, period?: Period, userId?, limit = null, _changed?): Observable<Booking[]> {
    let params = '';
    let itemsPerPage = 10;

    if (limit !== null) {
        itemsPerPage = limit;
      }

    if (canceled === true) {
        params += 'canceled=true&order[startAt]=DESC';
      } else {
        params += 'canceled=false';
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

    // if (this.environmentService.getEnvFile().useMb) {
    //     if (changed) {
    //       this.params = '&club.id[]=' + changed;
    //       params += this.params;
    //     } else {
    //       this.environmentService.getEnvFile().marqueBlanche.clubIds.forEach(id => {
    //         params += '&club.id[]=' + id;
    //       });
    //     }

    //   }

    if (this.whiteLabelId) {
      params += `&whiteLabel.id=${this.whiteLabelId}`;
    } else {
      this.currentClubId$.subscribe(clubId => {
        params += `&club.id[]=${clubId}`;
      });
    }

      // TODO: delete after tests TO TEST ERROR DISPLAY
      // return throwError("ERROR");

    return this.httpService.baseHttp<Booking[]>('get', `/clubs/bookings?activityType=lesson&${params}&participants.user.id=${userId}&${params}&itemsPerPage=${itemsPerPage}&page=1&confirmed=true`, true)
        .pipe(
          filter( data => data !== undefined),
          map( (bookings) => {
            bookings['hydra:member'].map( booking => {
              booking['startAt'] = moment(booking.startAt).tz(booking.club.timezone).format();
              booking['endAt'] = moment(booking.endAt).tz(booking.club.timezone).format();
              return booking;
            });
            // bookings['hydra:member'] = timeFormattedBookings;
            return bookings;
          })
        );
  }

  createBooking(booking: Booking, _timezone: string = 'Europe/Paris') {
    return this.httpService.baseHttp<Club>('post', '/clubs/bookings', booking, true);
  }

  addParticipantCourse(data: any) {
    return this.httpService.baseHttp<any>('post', '/clubs/bookings/participants', data, true);
  }


  updateParticipantCourse(data: any, bookingId: any) {
    return this.httpService.baseHttp<any>('put', `${bookingId}`, data, true);
  }


  updateBooking(booking: Booking | any) {
    return this.httpService.baseHttp<Club>('put', '/clubs/bookings/' + booking.id, booking, true);
  }


  putDataBooking(iri: string, data: any) {
    return this.httpService.baseHttp<Club>('put', iri, data, true);
  }

  lastBookings(dateNow: string): Observable<Booking[]> {
    return this.httpService.baseHttp<Club>('get',
        '/clubs/bookings?itemsPerPage=5&page=1&startAt[strictly_before]&confirmed=true' + dateNow);
  }

  getPaymentMethod(id: string): Observable<PaymentMethods> {
    return this.httpService.baseHttp<PaymentMethods>('get', `/clubs/bookings/${id}/payment-methods`);
  }

  serializeBooking(booking: Booking) {
    const serializedBooking = booking;
    serializedBooking.activity = booking.activity['@id'];
    serializedBooking.club = booking.club['@id'];
    serializedBooking.userClient = booking.userClient['@id'];
    const playgrounds = [];
    booking.playgrounds.forEach(playground => {
      playgrounds.push(playground['@id']);
    });
    serializedBooking.playgrounds = playgrounds;

    const participants = [];
    booking.participants.forEach(participant => {
      if (participant['@id']) {
        participants.push(participant['@id']);
      } else {
        participants.push({
          user: participant.user['@id'],
          subscriptionCard: participant.subscriptionCard
        });
      }
    });
    serializedBooking.participants = participants;

    return serializedBooking;
  }
}
