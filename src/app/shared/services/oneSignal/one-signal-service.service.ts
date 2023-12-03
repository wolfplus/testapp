import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { of } from 'rxjs';
import { Notification } from '../../models/notification';
import { ClubDetailComponent } from '../../../club-detail/club-detail.component';
import { BookingDetailComponent } from '../../../modal/booking/booking-detail/booking-detail.component';
import { BookingService } from '../booking/booking.service';
import { MatchDetailComponent } from '../../../matches/match-detail/match-detail.component';
import { MatchService } from '../../../matches/match.service';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../user/auth.service';
import OneSignal from 'onesignal-cordova-plugin';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
import { EnvironmentService } from '../environment/environment.service';

@Injectable({
  providedIn: 'root'
})
export class OneSignalServiceService {

  constructor(
      private modalCtr: ModalController,
      private bookingService: BookingService,
      private matchService: MatchService,
      private store: Store<AppState>,
      private authService: AuthService,
      private environmentService: EnvironmentService
  ) { }

  initOneSignal() {
      OneSignal.setAppId(this.environmentService.getEnvFile().oneSignalAppId);
      OneSignal.setNotificationOpenedHandler((jsonData) => {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
          this.routingNotificationPush(jsonData.notification.additionalData);
      });

      // iOS - Prompts the user for notification permissions.
      //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
      OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
          console.log("User accepted notifications: " + accepted);
      });
      OneSignal.addSubscriptionObserver(function (data) {
          const onesignalUserId = data.to.userId;
          Preferences.set({key: 'ONE_SIGNAL_TOKEN', value: onesignalUserId}).then();
      });
  }

  addOnesignalIdUser() {
    // GET FROM Preferences userId token Onesignal
    Preferences.get({key: 'ONE_SIGNAL_TOKEN'}).then(item => {
      this.store.select('user')
          .pipe(
              take(1),
              switchMap(user => {
                if (user && user.oneSignalPlayerIds !== undefined) {
                  if (item.value && !(user.oneSignalPlayerIds.includes(item.value))) {
                    // todo : POST item
                    return this.authService.addUserNotificationPlayerid({user: user['@id'], reference: item.value});
                  } else {
                    return of(null);
                  }
                } else {
                  return of(null);
                }
              })
          )
          .subscribe();
    });
  }

  routingNotification(notification: Notification|any) {
    switch (notification.targetType) {
      case 'match':
        this.matchService.getMatch(notification.targetId)
            .pipe(
                tap(data => {
                  this.modalCtr.create({
                    component: MatchDetailComponent,
                    cssClass: 'match-details-class',
                    componentProps: {matchId: notification.targetId, matchActivityId: data.activity.id},
                    swipeToClose: true
                  }).then(mod => {
                    mod.present().then();
                  });
                }))
            .subscribe();
        break;
      case 'event':
        // TODO : add link to event detail view
        break;
      case 'booking':
        this.bookingService.getBooking(notification.targetId)
            .subscribe(data => {
              this.modalCtr.create({
                component: BookingDetailComponent,
                componentProps: {booking: data},
                swipeToClose: true
              }).then(mod => {
                mod.present().then();
              });
            });
        break;
      case 'club':
        this.modalCtr.create({
          // component: ClubPage,
          component: ClubDetailComponent,
          cssClass: 'club-details-class',
          componentProps: {id: notification.targetId},
          swipeToClose: true
        }).then(mod => {
          mod.present().then();
        });
        break;
    }
  }

    routingNotificationPush(notification) {
        switch (notification.target) {
            case 'match':
                this.matchService.getMatch(notification.targetId)
                    .pipe(
                        tap(data => {
                            this.modalCtr.create({
                                component: MatchDetailComponent,
                                cssClass: 'match-details-class',
                                componentProps: {matchId: notification.targetId, matchActivityId: data.activity.id},
                                swipeToClose: true
                            }).then(mod => {
                                mod.present().then();
                            });
                        }))
                    .subscribe();
                break;
            case 'event':
                // TODO : add link to event detail view
                break;
            case 'booking':
                this.bookingService.getBooking(notification.targetId)
                    .subscribe(data => {
                        this.modalCtr.create({
                            component: BookingDetailComponent,
                            componentProps: {booking: data},
                            swipeToClose: true
                        }).then(mod => {
                            mod.present().then();
                        });
                    });
                break;
            case 'club':
                this.modalCtr.create({
                    // component: ClubPage,
                    component: ClubDetailComponent,
                    cssClass: 'club-details-class',
                    componentProps: {id: notification.targetId},
                    swipeToClose: true
                }).then(mod => {
                    mod.present().then();
                });
                break;
        }
    }
}
/*
{
  "from":
    {
      "isSubscribed":false,
      "userId":null,
      "pushToken":null
    },
  "to":
    {
      "isSubscribed":true,
      "userId":"477f96fe-9c05-4419-98e8-5d0f8839917f",
      "pushToken":"764d3cf3ef5eb13202d4d9990cd9a5bdd5593272c5433946ac1d134f42ec3bd0"
    }
}


 */
