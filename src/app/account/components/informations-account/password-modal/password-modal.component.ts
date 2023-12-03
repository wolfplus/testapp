import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../shared/services/user/auth.service";
import {tap} from "rxjs/operators";
import {ModalController, NavController} from "@ionic/angular";
import {ToastService} from "../../../../shared/services/toast.service";

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent implements OnInit {
    isFocus: boolean;
  password: any;
  errorPhoneMessage: string;

  constructor(private authService: AuthService,
              private nav: NavController,
              private modalCtrl: ModalController,
              private toastService: ToastService
              ) { }

  ngOnInit(): void {
  }

  passwordChange() {

  }

  confirmPassword() {
    this.authService.checkPassword(this.password).pipe(
        tap(passResult => {
          if (passResult.isPasswordValid) {
              this.nav.navigateRoot('/home').then(() => {
                  this.modalCtrl.dismiss()
                  this.toastService.presentSuccess("account_deleted", 'top')
                  this.authService.logout();
              });
          } else {
              this.toastService.presentError("bad_password", 'top')
          }
        })
    ).subscribe()
  }
}
