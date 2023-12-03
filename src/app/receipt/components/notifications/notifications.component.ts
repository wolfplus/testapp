import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {NotificationService} from '../../../shared/services/messages/notification.service';
import {Observable, of} from 'rxjs';
import {Notification} from '../../../shared/models/notification';
import {OneSignalServiceService} from '../../../shared/services/oneSignal/one-signal-service.service';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import { filter, switchMap, take, tap } from 'rxjs/operators';

import { IonInfiniteScroll } from '@ionic/angular';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {select, Store} from "@ngrx/store";
import {getCurrentClub} from "../../../club/store";
import {ClubState} from "../../../club/store/club.reducers";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @Input() refresh$: Observable<boolean> = of(true);
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  skeleton = true;
  notifications: Notification[];
  env;
  nextPage: string;
  hasNext: boolean;
  club: any = null;

  constructor(
    private notifService: NotificationService,
    private oneSignalService: OneSignalServiceService,
    private translate: TranslateService,
    private environmentService: EnvironmentService,
    private clubStore: Store<ClubState>
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit(): void {
    this.clubStore.pipe(
        select(getCurrentClub),
        tap(club => {
          this.club = club;
        })
    ).subscribe();
    this.refresh$.pipe(
      filter(refresh => refresh !== false),
      switchMap( () => {
        return this.notifService.getAllNotifications(false)
          .pipe(
            tap( () => {
              this.skeleton = false;
            }),
            filter(data => data !== undefined),
            // map( data => data['hydra:member']),
            tap( (data: any) => {
              this.notifications = data;
              if (this.notifService.hasNext === true) {
                this.infiniteScroll.disabled = false;
              }
              if (this.notifications.length === 0) {
                // TODO: if no notifications
              }
            })
          );
      })
    )
    .subscribe();
  }

  onVisible(notification){
    if (notification.viewed === false) {
      this.notifService.updateNotification(notification['@id'])
        .pipe(
          tap( response => {
            if (response) {
              const notificationToUpdate = this.notifications.find(notif => notif['@id'] === response['@id']);
              if (notificationToUpdate) {
                setTimeout( _ => {
                  notificationToUpdate.viewed = true;
                }, 1000);
              }
            }
          })
        )
        .subscribe();
    }
  }

  open(notification: Notification) {
    this.oneSignalService.routingNotification(notification);
  }

  dateDateString(dateString: string) {
    const date = moment(dateString).tz(this.club.timezone);
    const now = moment().tz(this.club.timezone);

    if (now.format('YYYYMMDD') === date.format('YYYYMMDD')) {
      return this.translate.instant('today') + " " + date.format('HH:mm');
    }
    return date.format('DD/MM/YYYY');
  }

  loadMoreData(event) {
    if (!this.notifService.hasNext) {
      event.target.complete();
      event.target.disabled = true;
    } else {
      event.target.disabled = false;
      event.target.enabled = true;
    }
    this.notifService.getNextPageNotifications(this.notifService.nextPage)
      .pipe(
        take(1),
        tap( notifs => this.notifications = [...this.notifications, ...notifs]),
        tap( () => event.target.complete())
      )
      .subscribe();
  }

}
