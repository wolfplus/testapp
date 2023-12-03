import {Component, EventEmitter, Input, OnInit, Output, OnChanges} from '@angular/core';
import {AttenderBooking} from '../../shared/models/attender-booking';
import {User} from '../../shared/models/user';
import {UserService} from '../../shared/services/storage/user.service';
import {Friend} from '../../shared/models/friend';
import {AlertController, ModalController} from '@ionic/angular';
import {SelectFriendsComponent, SelectFriendsConfig} from '../friends/select-friends/select-friends.component';
import {AccountService} from '../../shared/services/account/account.service';
import {Avatar} from '../../shared/models/avatar';

import { getPrimaryColor } from 'src/utils/get-primary-color';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-booking-attenders',
  templateUrl: './booking-attenders.component.html',
  styleUrls: ['./booking-attenders.component.scss'],
})
export class BookingAttendersComponent implements OnInit, OnChanges {
  @Input() attenders: Array<AttenderBooking|Friend>;
  @Input() maxAttenders: number;
  @Input() currency: string;

  @Input() isBooking: boolean;
  @Input() pricePerParticipant: number;
  @Input() allDataLoaded: boolean;
  @Output() changeAttenders = new EventEmitter<Array<any>>();
  @Output() showFriendOrUserModal = new EventEmitter<any>();
  @Output() resetAddBool = new EventEmitter<any>();
  @Output() removeParticipant = new EventEmitter<AttenderBooking|Friend>();

  list: Array<any>;
  user: User;
  userSkeleton = true;
  showFriends: boolean;
  pathFile = this.environmentService.getEnvFile().pathFiles;
  attendersLeft: Array<number> = [];
  avatarBgColor = 'lightGray';
  @Input() boolAddPart: boolean;
  @Input() typeOfUserToAdd: string


  constructor(
    private userService: UserService,
    private modalCtr: ModalController,
    private accountService: AccountService,
    private environmentService: EnvironmentService,
    private translate: TranslateService,
    private alertController: AlertController,
  ) {
    this.showFriends = false;
    this.avatarBgColor = getPrimaryColor();
  }

  ngOnInit() {
    this.userSkeleton = true;
    this.userService.get().subscribe((user: any) => {
      this.userSkeleton = false;
      this.user = user;
    });

  }

  ngOnChanges() {
    if(this.boolAddPart) {
      this.addParticipant(this.typeOfUserToAdd)
    }
    this.handleAttenderLeft();
  }

  changeAttendersList() {
    this.changeAttenders.emit(this.attenders);
  }

  openModalAddFriendOrUser() {
    this.showFriendOrUserModal.emit('')
  }

  async removeAttender(id: number, attender: AttenderBooking|Friend) {
    if(this.isBooking) {
      const alert = await this.alertController.create({
        header: this.translate.instant('title_alert_booking'),
        message: this.translate.instant('message_alert_participant_canceled'),
        buttons: [
          {
            text: this.translate.instant('yes'),
            handler: async () => {
              await this.confirmRemoveAttender(id, attender);
            }
          }, {
            text: this.translate.instant('no')
          }
        ]
      });
      await alert.present();
    } else {
      await this.confirmRemoveAttender(id, attender);
    }
  }

  async confirmRemoveAttender(id: number, attender: AttenderBooking|Friend) {
    const newList = [];
    this.attenders.forEach((item, i) => {
      if (i !== id) {
        newList.push(item);
      }
    });
    this.attenders = newList;
    this.removeParticipant.emit(attender);
    this.changeAttenders.emit(this.attenders);
    if(this.isBooking) {
      this.handleAttenderLeft();
    }
  }

  addParticipant(typeOfUser) {
      this.modalCtr.create({
        component: SelectFriendsComponent,
        cssClass: 'friends-select-class',
        componentProps: {
          isCreationMode: true,
          selectedFriends: this.attenders,
          maxAttenders: (this.maxAttenders - 1),
          action: 'add',
          config: SelectFriendsConfig.BOOKING_CREATE,
          typeOfUser: typeOfUser
        }
      }).then(mod => {
        mod.present().then(() => {
          mod.onDidDismiss().then(data => {
            this.attenders = data.data;
            this.changeAttenders.emit(this.attenders);
            this.resetAddBool.emit('');
          });
        });
      });
  }

  closeFriends() {
    this.showFriends = false;
  }

  getAvatar(attender): Avatar {
    let avatar = null;
    this.accountService.getAvatar(attender.avatar)
      .subscribe(data => {
        avatar = data;
      });
    return avatar;
  }

  handleAttenderLeft() {
    if (this.attenders.length > this.maxAttenders) {
      this.attenders.length = this.maxAttenders;
      this.changeAttenders.emit(this.attenders);
    }
    console.log(this.maxAttenders - this.attenders.length, this.maxAttenders, this.attenders.length, "<=== this.maxAttenders - this.attenders.length")
    this.attendersLeft = new Array(this.maxAttenders - this.attenders.length);
  }
}
