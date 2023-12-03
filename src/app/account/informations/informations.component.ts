import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AccountService } from '../../shared/services/account/account.service';
import { UserService } from '../../shared/services/storage/user.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../shared/models/user';

import { ToastService } from '../../shared/services/toast.service';
import { PhotoService } from 'src/app/shared/services/photo.service';
import * as moment from 'moment';
import { filter, tap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss'],
  providers: []
})
export class InformationsComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  imageAvatar: string;
  capturedSnapURL: string;
  data: any;
  user: User;
  moment = moment;
  openCalendar = false;
  urlPath: string;
  maxDate = new Date().toLocaleDateString();
  customPickerOptions: { buttons: { text: string; handler: () => void; }[]; };
  isEditingPic = false;
  doneText: any;
  cancelText: any;

  constructor(
    private userService: UserService,
    public alertController: AlertController,
    private translate: TranslateService,
    private accountService: AccountService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private photoService: PhotoService,
    private environmentService: EnvironmentService
  ) {
    this.imageAvatar = 'assets/images/avatar.png';
    this.urlPath = this.environmentService.getEnvFile().pathFiles;
    this.maxDate = moment(new Date()).subtract(10, 'years').format().toString();
  }

  ngOnInit(): void {
    this.doneText = this.translate.instant('validate');
    this.cancelText = this.translate.instant('cancel');

    this.userService.get()
      .pipe(
        filter( user => user !== null && user !== undefined),
        tap( user => {
          this.user = user;

          if (!this.isEditingPic) {
            this.data = {
              firstName: this.user.firstName,
              lastName: this.user.lastName,
              email: this.user.email,
              birthDate: this.user.birthDate,
              city: this.user.city,
              zipCode: this.user.zipCode,
              addressTmp: (this.user.address !== null) ? ((this.user.address.length > 0) ? this.user.address[0] : '') : '',
              imageAvatar: this.user.avatar !== null && this.user.avatar.contentUrl !== null ? this.user.avatar.contentUrl : null,
              avatarName: this.user.firstName.slice(0, 1) + this.user.lastName.slice(0, 1)
            };
          } else {
            this.data.imageAvatar = this.user.avatar !== null && this.user.avatar.contentUrl !== null ? this.user.avatar.contentUrl : null;
            this.data.avatarName = this.user.firstName.slice(0, 1) + this.user.lastName.slice(0, 1);
          }

          this.isEditingPic = false;
        })
      )
      .subscribe();
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }

  confirm() {
    // Todo confirm validity data
    this.data.address = [this.data.addressTmp];
    this.accountService.updateUser(this.data, this.user.id).subscribe(user => {
      if (user) {
        this.userService.add(user);
        this.toastService.presentSuccess(this.translate.instant('update_user_success'));
        this.close();
      }
    });
  }

  triggerCalendar() {
    setTimeout(() => {
      this.openCalendar = true;
    }, 5)
  }

  closeCalendar(event) {
    if(event.target.classList.contains('calendar-modal')) {
      this.openCalendar = false;
    }
  }

  dateTimeAction(action) {
    if(!action) {
      this.data.birthDate = this.user.birthDate;
    }

    this.openCalendar = false;
  }

  addPic() {
    this.isEditingPic = true;
    if (this.user.avatar && this.user.avatar["@id"]) {
      this.photoService.changeAvatar('profile', this.user.avatar["@id"]);
    } else {
      this.photoService.changeAvatar('profile');
    }
  }

}
