import {Component, Input, OnInit} from '@angular/core';
import {Notification} from '../../../shared/models/notification';
import {NotificationService} from '../../../shared/services/messages/notification.service';
import {ModalController} from '@ionic/angular';
import { tap } from 'rxjs/operators';
import {select, Store} from "@ngrx/store";
import {ClubState} from "../../../club/store/club.reducers";
import {getCurrentClub} from "../../../club/store";

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @Input() from: string;
  @Input() fromName: string;

  club: any = null;
  conversations: Array<Notification>;

  constructor(
      private modalCtr: ModalController,
      private clubStore: Store<ClubState>,
      private notifService: NotificationService
  ) {
    this.conversations = [];
  }

  ngOnInit(): void {
    this.clubStore.pipe(
        select(getCurrentClub),
        tap(club => {
          this.club = club;
        })
    ).subscribe();
    this.notifService.getAllNotifications(true)
      .subscribe(data => {
        if (data) {
          // const notifications = data['hydra:member'];
          const notifications = data;
          notifications.forEach(notification => {
            if (notification.userClientRequester['@id'] === this.from) {
              this.conversations.push(notification);
            }
          });
        }
      });
  }

  onVisible(notification){
    if (notification.viewed === false) {
      this.notifService.updateNotification(notification['@id'])
        .pipe(
          tap( response => {
            if (response) {
              const notificationToUpdate = this.conversations.find(notif => notif['@id'] === response['@id']);
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

  close() {
    this.modalCtr.dismiss().then();
  }
}
