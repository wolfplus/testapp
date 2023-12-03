import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Club } from '../shared/models/club';
import { ModalController, AlertController } from '@ionic/angular';
import { ProfileConfig, User } from '../shared/models/user';
import { of, Subscription, BehaviorSubject } from 'rxjs';
import { AccountService } from '../shared/services/account/account.service';
import { FriendService } from '../shared/services/friend/friend.service';
import { LoaderService } from '../shared/services/loader/loader.service';
import {catchError, filter, map, switchMap, tap} from 'rxjs/operators';
import { UserService } from '../shared/services/storage/user.service';
import { getPrimaryColor } from 'src/utils/get-primary-color';
import { ToastService } from '../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentService } from '../shared/services/environment/environment.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  @Input() id: string;

  user: User;
  player: any;
  playerSub$ = new BehaviorSubject({});
  player$ = this.playerSub$.asObservable();
  pathFile: string;
  data: any = null;
  clubs: Array<Club> = [];
  avatarAlternative = 'https://eu.ui-avatars.com/api/?background=DBDBDB&color=fff&name=';
  allSubscriptions$ = new Subscription();
  ProfileConfig = ProfileConfig;
  env;

  constructor(
    private modalCtr: ModalController,
    private accountService: AccountService,
    private friendService: FriendService,
    private loaderService: LoaderService,
    private userService: UserService,
    private toastService: ToastService,
    private alertController: AlertController,
    private translate: TranslateService,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.pathFile = environmentService.getEnvFile().pathFiles;
  }

  ngOnInit(): void {
    if (this.id.includes('client')) {
      this.id = this.id.replace('/user-clients/', '');
    }
    this.avatarAlternative = `https://eu.ui-avatars.com/api/?background=${getPrimaryColor()}&color=fff&name=`;

    this.allSubscriptions$.add(this.userService.get()
      .pipe(
        filter( user => user !== undefined),
        tap( (user: any) => {
          this.user = user;
        }),
        switchMap( () => this.accountService.getDataUserClient(this.id)),
        map( player => this.player = player),
        tap( () => {
          this.playerSub$.next(this.player);
        })
      )
      .subscribe()
    );
  }

  shortLastName(lastName: string) {
    return lastName.split('')[0] + '.';
  }

  manageFriendship(event) {
    switch (event) {
      case "add":
        this.addFriend();
        break;
      case "remove":
        this.presentAlertConfirm('remove').then();
        break;
      case "cancel_request":
         this.presentAlertConfirm('cancel').then();
         break;
     case "accept_request":
         this.presentAlertConfirm('accept').then();
         break;
    default:
        return;
    }
  }

  removeFriend() {
    this.loaderService.presentLoading();
    this.allSubscriptions$.add(this.friendService.removeFriendShip(this.player.id)
      .pipe(
        tap( () => {
          this.loaderService.dismiss();
          this.player.friendshipStatus = "not_friend";
          this.playerSub$.next(this.player);
          // this.toastService.presentSuccess('friendship_request_sent', 'top');
        }),
        catchError(err => {
          this.loaderService.dismiss();
          return of(console.error("removeFriendShip error: ", err));
        })
      )
      .subscribe()
    );
  }

  addFriend() {
    this.loaderService.presentLoading();
    // let counter = 0;
    const data = {
      requesterUser: this.user['@id'],
      receiverUser: '/user-clients/' + this.player['id']
    };

    this.allSubscriptions$.add(this.friendService.sendInvit(data)
      .pipe(
        tap( res => {
          // counter += 1;
          if (res !== undefined) {
            this.loaderService.dismiss();
            this.player.friendshipStatus = "friend_request_pending_from_you";
            this.playerSub$.next(this.player);
            this.toastService.presentSuccess('friendship_request_sent', 'top');
          }
        }),
        catchError(err => {
          /* TODO: ??? */
          // return err;
          this.loaderService.dismiss();
          return of(console.error("ERROR: ", err));
        })
      )
      .subscribe()
    );
  }

  cancelRequest() {
    this.allSubscriptions$.add(this.friendService.getFriendRequests()
      .pipe(
        map(friendRequests => {
          if (friendRequests !== undefined) {
            return this.returnPlayerInvitIri(friendRequests['hydra:member']);
          }
          return undefined;
        }),
        switchMap( requestIri => {
          if (requestIri !== undefined && requestIri !== null) {
            return this.friendService.cancelInvit(requestIri);
          }
          return of(undefined);
        }),
        tap( response => {
          if (response !== undefined) {
            this.loaderService.dismiss();
            this.player.friendshipStatus = 'not_friend';
            this.playerSub$.next(this.player);
            this.toastService.presentSuccess('friendship_request_canceled', 'top');
          } else {
            this.loaderService.dismiss();
            this.toastService.presentError('friendship_request_cancelation_failed', 'top');
          }
        })
      )
      .subscribe()
    );
  }

  async presentAlertConfirm(choice: string) {
    let header = "";
    let message = "";

    if (choice === "remove") {
      header = this.translate.instant('remove_friendship_warning_title');
      message = this.translate.instant('remove_friendship_warning_text');
      const alert = await this.alertController.create({
        cssClass: 'alert_cancellation',
        header,
        message,
        buttons: [
          {
            text: this.translate.instant('cancel'),
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: this.translate.instant('alert_confirm'),
            handler: () => {
              this.removeFriend();
            }
          }
        ]
      });
      await alert.present();
    } else if (choice === "accept") {
      header = this.translate.instant('friendship_request_acceptance_title');
      message = this.translate.instant('friendship_request_acceptance_text');
      const alert = await this.alertController.create({
        cssClass: 'alert_cancellation',
        header: this.translate.instant('friendship_request_cancelation_title'),
        message: this.translate.instant('friendship_request_warning_text'),
        buttons: [
          {
            text: this.translate.instant('cancel'),
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: this.translate.instant('alert_confirm'),
            handler: () => {
              this.cancelRequest();
            }
          }
        ]
      });
      await alert.present();
    } else if (choice === "cancel") {
      header = this.translate.instant('friendship_request_cancelation_title');
      message = this.translate.instant('friendship_request_warning_text');
      const alert = await this.alertController.create({
        cssClass: 'alert_cancellation',
        header: header,
        message: message,
        buttons: [
          {
            text: this.translate.instant('cancel'),
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: this.translate.instant('alert_confirm'),
            handler: () => {
              this.cancelRequest();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  returnPlayerInvitIri(friendRequests) {
    const sentRequest = friendRequests.find( request => {
      const iriPlayer = '/user-clients/' + this.player['id'];
      const iriUser = '/user-clients/' + this.user['id'];

      return request.receiverUser === iriPlayer && request.requesterUser === iriUser;
    });
    if (sentRequest !== undefined) {
      return sentRequest['@id'];
    }
    return null;
  }

  close() {
    this.modalCtr.dismiss().then();
  }

  ngOnDestroy() {
    this.allSubscriptions$.unsubscribe();
  }

}
