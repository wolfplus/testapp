import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../models/notification';
import { filter, map, tap } from 'rxjs/operators';
import { EnvironmentService } from '../environment/environment.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  counterSub$ = new BehaviorSubject<number>(0);
  counter$ = this.counterSub$.asObservable();
  nextPage: string;
  hasNext: boolean;

  constructor(
    private httpService: HttpService,
    private environmentService: EnvironmentService
  ) {}

  getAllNotifications(requester: boolean = false): Observable<Notification[]> {
    let counter = 0;
    let params;
    if (this.environmentService.getEnvFile().useMb && this.environmentService.getEnvFile().marqueBlanche.whiteLabelId) {
      params = `&clubWhiteLabel.id=${this.environmentService.getEnvFile().marqueBlanche.whiteLabelId}`;
    } else {
        // TODO get club id
      params = `&exists[clubWhiteLabel]=false`;
    }
    return this.httpService.baseHttp('get', `/notifications?exists[userClientRequester]=${requester}${params}`)
      .pipe(
        tap( data => {
          if (data && data['hydra:view'] && data['hydra:view']['hydra:next']) {
            this.nextPage = data['hydra:view']['hydra:next'];
            this.hasNext = true;
          } else {
            this.hasNext = false;
          }
        }),
        filter( data => data !== undefined),
        map( data => data['hydra:member']),
        tap( notifs => {
          notifs.forEach( notif => {
            if (notif.viewed === false) {
              counter += 1;
            }
          });
          this.counterSub$.next(counter);
        })
      );
  }

  updateNotification(notifIri) {
    return this.httpService.baseHttp<any>('put', `${notifIri}`, {viewed: true}, true)
      .pipe(
        tap( response => {
          if (response) {
            if (this.counterSub$.getValue() > 0) {
              this.counterSub$.next(this.counterSub$.getValue() - 1);
            }
          }
        })
      );
  }

  getNextPageNotifications(nextPage) {
    return this.httpService.baseHttp<any>('get', `${nextPage}`)
      .pipe(
        filter((data) => data !== undefined),
        tap( data => {
          if (data['hydra:view'] && data['hydra:view']['hydra:next']) {
            this.nextPage = data['hydra:view']['hydra:next'];
            this.hasNext = true;
          } else {
            this.hasNext = false;
          }
        }),
        map( data => data['hydra:member'])
      );
  }

}
