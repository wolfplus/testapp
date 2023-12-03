import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../../../shared/services/messages/notification.service';
import {ModalController} from '@ionic/angular';
import {ConversationComponent} from '../conversation/conversation.component';
import {Notification} from '../../../shared/models/notification';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ColorStyle, FontSize } from 'src/app/shared/models/style';

@Component({
  selector: 'app-invits',
  templateUrl: './invits.component.html',
  styleUrls: ['./invits.component.scss']
})
export class InvitsComponent implements OnInit {
  env;
  conversations: Array<any>;
  skeleton = true;
  notifications: Array<Notification>;
  pathFiles: string;
  FontSize = FontSize;
  ColorStyle = ColorStyle;

  constructor(
    private notifService: NotificationService,
    private modalCtr: ModalController,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.conversations = [];
    this.pathFiles = environmentService.getEnvFile().pathFiles;
  }

  ngOnInit(): void {
    const distinctUser = [];
    this.notifService.getAllNotifications(true).subscribe(data => {
      this.skeleton = false;
      if (data) {
        // this.notifications = data['hydra:member'];
        this.notifications = data;
        this.notifications.forEach(notification => {
          if (!distinctUser.includes(notification.userClientRequester['@id'])) {
            this.conversations.push(notification.userClientRequester);
            distinctUser.push(notification.userClientRequester['@id']);
          }
        });
      }
    });
  }

  open(userClientRequesterId: string, fromName: string) {
    this.modalCtr.create({
      component: ConversationComponent,
      componentProps: {from: userClientRequesterId, fromName},
      swipeToClose: true
    }).then(mod => {
      mod.present().then();
    });
  }

  unRead(userIri) {
    for (let index = 0; index < this.notifications.length; index++) {
      const notification = this.notifications[index];
      if (notification.userClientRequester === userIri) {
        if (notification.viewed) {
          return true;
        }
      }
    }
    return false;
  }
}
