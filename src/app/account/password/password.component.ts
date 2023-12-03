import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AuthService} from '../../shared/services/user/auth.service';
import { User } from 'src/app/shared/models/user';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import * as AccountActions from "../store/account.actions";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  user: User;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  userMe:any;

  passwordLength = false;
  passwordLengthString = '';
  passwordNotMatching = false;
  passwordNotMatchingString = '';
  notActualPassword = false;
  notActualPasswordString = '';

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private accountStore: Store<any>,
    private clubIdStorageService: ClubIdStorageService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modalCtrl.dismiss({refresh: true}).then();
  }

  async confirm() {
    const guid =  await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
    this.userMe = await this.authService.getConnectedUser(guid).toPromise();

    await this.accountStore.dispatch(AccountActions.setMe({ data: this.userMe }));



    await this.authService.checkPassword(this.oldPassword).subscribe(
      async (res) => {
        if(res.isPasswordValid) {
          this.notActualPassword = false;
          if(this.newPassword === this.confirmPassword) {
            this.passwordNotMatching = false;
            if(this.newPassword.length > 7) {
              this.passwordLength = false;
              await this.authService.updateUser(this.userMe.id, {plainPassword: this.newPassword, password: this.newPassword}).subscribe(
                () => {
                  this.toastService.presentSuccess(this.translateService.instant('new_password_update_success'), 'top');
                  this.close();
                },
                (error) => {
                  console.log(error)
                }
              );
            } else {
              this.passwordLength = true;
              this.passwordLengthString = this.translateService.instant('password-length');
            }
            
          } else {
            this.passwordNotMatching = true;
            this.passwordNotMatchingString = this.translateService.instant('password-not-matching');
          }
        } else {
          this.notActualPassword = true;
          this.notActualPasswordString = this.translateService.instant('not-actual-password');
        }
      }
    )



  }
}
