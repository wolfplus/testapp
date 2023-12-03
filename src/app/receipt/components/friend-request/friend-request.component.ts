import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../../shared/models/notification';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { ModalService } from '../../../shared/services/modal.service';
import { catchError, tap } from 'rxjs/operators';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { FriendService } from '../../../shared/services/friend/friend.service';
import * as moment from 'moment';
import { PlayerComponent } from 'src/app/player/player.component';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss']
})
export class FriendRequestComponent implements OnInit {
  @Input() notification: Notification;
  @Input() club: any;

  friendRequest: any;
  loaded = false;

  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
    private modalService: ModalService,
    private loaderService: LoaderService,
    private friendService: FriendService
  ) {
    this.friendRequest = null;
  }

  ngOnInit(): void {
    this.loadFriendRequest();
    this.notification.createdAt = moment(this.notification.createdAt).tz(this.club.timezone).format('YYYY-MM-DD HH:mm:ss');
  }

  loadFriendRequest() {
    this.friendService.getFriendRequest(this.notification.targetId)
      .pipe(
        tap(() => {
          this.loaded = true;
        }),
        catchError(() => {
          this.loaded = true;
          return null;
        })
      )
      .subscribe(data => {
        if (data) {
          this.friendRequest = data;
        }
      });
  }

  async canceled() {
    const alert = await this.alertController.create({
      header: this.translate.instant('title_alert_friend_request'),
      message: this.translate.instant('message_alert_friend_request_canceled'),
      buttons: [
        {
          text: this.translate.instant('yes'),
          handler: () => {
            this.confirmCanceled();
          }
        }, {
          text: this.translate.instant('no')
        }
      ]
    });
    await alert.present();
  }

  accept() {
    const iri = '/user-clients/friend-requests/' + this.notification.targetId;
    this.loaderService.presentLoading();
    this.friendService.acceptInvit(iri).pipe(
      catchError(err => {
          return err;
      })
    )
    .subscribe(() => {
      this.loadFriendRequest();
      this.loaderService.dismiss();
    });
  }

  refuse() {
    const iri = '/user-clients/friend-requests/' + this.notification.targetId;
    this.loaderService.presentLoading();
    this.friendService.cancelInvit(iri).pipe(
      catchError(err => {
        return err;
      })
    )
    .subscribe(() => {
      this.loadFriendRequest();
      this.loaderService.dismiss();
    });
  }

  confirmCanceled() {
    this.refuse();
  }

  showPlayer() {
    this.modalService.playerModal(PlayerComponent, this.notification.userClientRequester['@id']);
  }
}
