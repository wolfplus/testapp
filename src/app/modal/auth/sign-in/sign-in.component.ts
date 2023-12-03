import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../../config/config.service';
import { AuthService } from '../../../shared/services/user/auth.service';
import { catchError, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UserTokenService } from '../../../shared/services/storage/user-token.service';
import { ModalController } from '@ionic/angular';
import { User } from '../../../shared/models/user';
import { HttpService } from '../../../shared/services/http.service';
import intlTelInput from 'intl-tel-input';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { of } from 'rxjs';
import { OneSignalServiceService } from 'src/app/shared/services/oneSignal/one-signal-service.service';
import { getSecondaryColor } from 'src/utils/getSecondaryColor';
import { ToastService } from 'src/app/shared/services/toast.service';

import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {Router} from "@angular/router";
import {MatchDetailComponent} from "../../../matches/match-detail/match-detail.component";
import * as AccountActions from "../../../account/store/account.actions";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit {
  @Input() matchId: string;
  @Input() matchActivityId: string;
  @Input() isEditable = true;
  @Input() routeOpen: boolean;
  @Output() reloadMatches = new EventEmitter();
  phoneNumber: string;
  separateDialCode: boolean;
  SearchCountryField: any;
  TooltipLabel: any;
  CountryISO: any;
  preferredCountries: Array<any>;
  form: any;
  submitAttempt: boolean = false;
  logoUrl: string;
  inputType: string = "email";
  errorPhone: boolean;
  errorPhoneMessage: string;
  showPasswordInput: boolean;
  password: string;
  stepLogin: number;
  showPhoneCode: boolean;
  phoneCode: number;
  showPhoneInput: boolean;
  showUpdatePassword: boolean;
  showConfirmResetPassword: boolean;
  showResetPassword: boolean;
  token: string;
  iti: any;
  isFocus: boolean;
  env;
  showPhoneCodeText: boolean;
  secondaryColorIsWhite: boolean;
  email : string | undefined = undefined;
  showPassword: boolean = false;
  passwordImage = '';
  welcome = '';
  forgotImage = '';

  @Output() public event: EventEmitter<void> = new EventEmitter<void>();

  constructor(
      private config: ConfigService,
      private authService: AuthService,
      private userToken: UserTokenService,
      private modalCtr: ModalController,
      private httpService: HttpService,
      public translate: TranslateService,
      public loaderService: LoaderService,
      private oneSignalService: OneSignalServiceService,
      private toastService: ToastService,
      private accountStore: Store<any>,
      private environmentService: EnvironmentService,
      private router: Router,
      private modalController: ModalController,
      private formBuilder: FormBuilder
  ) {
    this.env = this.environmentService.getEnvFile();
    this.isFocus = false;
    this.showBlock('input_phone');
    this.logoUrl = this.config.getLogoUrl();
    this.separateDialCode = false;

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]],
    });
    this.errorPhone = false;
    this.errorPhoneMessage = '';
    this.welcome = 'assets/images/illustrations' + (this.env.useMb ? ('_' + this.env.marqueBlanche.pathName) : '') + '/welcome.svg';

    this.passwordImage = 'assets/images/illustrations' + (this.env.useMb ? ('_' + this.env.marqueBlanche.pathName) : '')  + '/create_password.svg';
    this.forgotImage = 'assets/images/illustrations' + (this.env.useMb ? ('_' + this.env.marqueBlanche.pathName) : '')  + '/forgot_password.svg';
  }

  ngOnInit(): void {
    const secondaryColor = getSecondaryColor();
    if (secondaryColor && secondaryColor === 'ffffff') {
      this.secondaryColorIsWhite = true;
    } else {
      this.secondaryColorIsWhite = false;
    }
  }

  ngAfterViewInit() {

  }

  phoneChange(event) {
    this.phoneNumber = event.target.value;
    this.errorPhoneMessage = '';
    this.errorPhone = false;
  }

  hasErrorPhoneNumber() {
  }

  passwordChange() {
    this.errorPhoneMessage = '';
    this.errorPhone = false;
  }
  countryChange() {
    this.errorPhoneMessage = '';
    this.errorPhone = false;
  }

  updateUrlWelcome() {
    this.welcome = 'assets/images/logos/icon_doin.png';
  }

  updateUrlPassword() {
    this.passwordImage = 'assets/images/logos/icon_doin.png';
  }

  updateUrlForgot() {
    this.forgotImage = 'assets/images/logos/icon_doin.png';
  }


  async confirmPhone() {
    if(this.inputType === 'phone') {
      this.phoneNumber = this.iti.getNumber();
      if (this.iti.getValidationError() > 0) {
        this.errorPhoneMessage = this.translate.instant('user_phone_not_valid');
        this.errorPhone = true;
        return;
      }
    }

    if(this.inputType === "email") {
      this.form.controls['email'].setValue(this.form.get('email').value.replace(/\s/g,'').toLowerCase());
    }

    if (this.inputType === "email" && !this.form.controls.email?.valid) {
      this.errorPhoneMessage = this.translate.instant('user_mail_not_valid');
      return;
    }
    await this.loaderService.presentLoading();
    this.errorPhoneMessage = '';
    this.errorPhone = false;
    this.submitAttempt = true;
    this.authService.checkIfUserExists(this.inputType === 'email' ? this.form.get('email').value : null, this.inputType === 'phone' ? this.phoneNumber : '').pipe(tap(resp => {

      if (resp.exist) {
        this.submitAttempt = false;
        // this.loaderService.dismiss();
        this.showBlock(resp.type);
      } else {
        if(this.inputType === 'email') {
          this.goToSignUp();
        } else {
          this.errorPhoneMessage = this.translate.instant('user_not_found');
          this.errorPhone = true;
        }
      }
      this.loaderService.dismiss();
    }), catchError(err => {

      this.loaderService.dismiss();
      return err;
    })).toPromise().then(() => {
      this.loaderService.dismiss();
    }).catch(() => {
      this.loaderService.dismiss();
    });
  }

  previous() {
    this.showBlock('input_phone');

    if(this.inputType === 'phone') {
      setTimeout(() => {
        const input = document.querySelector("#phone");
        this.iti = intlTelInput(input, {
          customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
            if (selectedCountryData.dialCode === '262') {
              return "Réunion (+262)"
            } else {
              return selectedCountryPlaceholder;
            }
          },
          // any initialisation options go here
          utilsScript: "src/utils/utils.js",
          initialCountry: this.env.defaultPhoneLang,
        });
      }, 50);
    } else {
      this.iti.destroy();
    }
  }

  changeInputType() {
    this.inputType = this.inputType === 'phone' ? 'email' : 'phone';
    this.errorPhoneMessage = '';
    this.errorPhone = false;
    this.showBlock('input_phone');

    if(this.inputType === 'phone') {
      setTimeout(() => {
        const input = document.querySelector("#phone");
        this.iti = intlTelInput(input, {
          customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
            if (selectedCountryData.dialCode === '262') {
              return "Réunion (+262)"
            } else {
              return selectedCountryPlaceholder;
            }
          },
          // any initialisation options go here
          utilsScript: "src/utils/utils.js",
          initialCountry: this.env.defaultPhoneLang,
        });
      }, 50);
    } else {
      this.iti.destroy();
    }
  }

  confirmPassword() {
    this.loaderService.presentLoading();
    this.errorPhone = false;
    this.authService.signInUser(this.inputType === 'email' ? this.form.get('email').value : this.phoneNumber, this.form.get('password').value)
      .pipe(
        tap( tokens => {
          // TODO : There add OneSignalService.AddOneSignal
          if (tokens && !this.errorPhone) {
            this.userToken.add(tokens).then(() => {
              this.authService.getConnectedUser()
                .subscribe(async (data) => {
                  await this.accountStore.dispatch(AccountActions.setMe({ data }));
                  this.close();
                  // this.oneSignalService.addOnesignalIdUser();
                  this.loaderService.dismiss();
                  const currentUrl = this.router.url;
                  this.router.navigate(['/account/me'], {skipLocationChange: true}).then(async () => {
                    if(this.matchId && !this.routeOpen) {
                      await this.router.navigateByUrl(`${currentUrl}`).then(async () => {
                        await this.modalController
                            .create({
                              component: MatchDetailComponent,
                              cssClass: 'match-details-class',
                              componentProps: {
                                matchId: this.matchId,
                                matchActivityId: this.matchActivityId,
                                isEditable: this.isEditable
                              },
                              animated: true
                            }).then( modal => {
                              modal.present();
                              modal.onDidDismiss()
                                  .then( returnedData => {
                                    if (returnedData.data) {
                                      if (returnedData.data['reload'] === true) {
                                        this.reloadMatches.emit(true);
                                      }
                                    }
                                  });
                            });
                      });
                    } else {
                      this.router.navigateByUrl(`${currentUrl}`);
                    }
                  });
                });
            }).catch(() => {
              this.loaderService.dismiss();
            });
          } else {
            this.toastService.presentError('bad_password', 'bottom');
            this.loaderService.dismiss();
            this.errorPhone = true;
          }
        }),
        catchError((err: any) => {
          this.loaderService.dismiss();
          this.errorPhone = true;
          this.errorPhoneMessage = this.translate.instant('bad_password');
          return of(err);
        })
      )
      .subscribe( () => {
        setTimeout( _ => {
          this.oneSignalService.addOnesignalIdUser();
        }, 2000);
        this.loaderService.dismiss();
      });
  }

  confirmResetPassword() {
    this.showBlock('confirm_reset_password');
  }

  sendCode() {
    if(this.inputType === 'email') {
      this.resetPassword();
    }
    this.showBlock('send_code_to_reset_password');
  }

  return() {
    this.showBlock('input_phone');

    if(this.inputType === 'phone') {
      setTimeout(() => {
        const input = document.querySelector("#phone");
        this.iti = intlTelInput(input, {
          customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
            if (selectedCountryData.dialCode === '262') {
              return "Réunion (+262)"
            } else {
              return selectedCountryPlaceholder;
            }
          },
          // any initialisation options go here
          utilsScript: "src/utils/utils.js",
          initialCountry: this.env.defaultPhoneLang,
        });
      }, 50);
    } else {
      this.iti.destroy();
    }
  }

  resetPassword() {
    // this.loaderService.presentLoading();
    if (!this.form.controls.email.valid) {
      this.loaderService.dismiss();
      this.errorPhoneMessage = this.translate.instant('user_phone_not_valid');
      this.errorPhone = true;
    } else {
      this.errorPhoneMessage = '';
      this.errorPhone = false;
      this.authService.getEmailValidationCode(this.form.get('email').value)
        .pipe(
          tap(() => {
            // this.showBlock('v2');
            this.loaderService.dismiss();
          }),
          catchError(err => {
            this.loaderService.dismiss();
            return err;
          })
        )
        .toPromise()
          .then(() => {
            this.loaderService.dismiss();
          })
          .catch(() => {
          this.loaderService.dismiss();
        });
    }

    /* this.errorPhone = false;
    this.errorPhoneMessage = '';
    if (this.phoneNumber !== '') {
      this.authService.checkIfUserExists(this.phoneNumber)
          .pipe(tap(resp => {
            if (resp.exist) {
              this.showBlock('v2');
            } else {
              this.errorPhoneMessage = this.translate.instant('user_not_found');
              this.errorPhone = true;
            }
            this.loaderService.dismiss();
          }), catchError(err => {
            this.loaderService.dismiss();
            return err;
          })).toPromise().then(() => {
            this.loaderService.dismiss();
          }).catch(err => {
            this.loaderService.dismiss();
          });

    } else {
      this.errorPhone = true;
      this.errorPhoneMessage = this.translate.instant('type_your_phone');
    } */
  }

  showBlock(version) {
    if  (version === 'v2') {
      this.showPasswordInput = false;
      this.showUpdatePassword = true;
      this.showPhoneInput = false;
      this.showPhoneCode = true;
      this.showConfirmResetPassword = false;
      this.showResetPassword = false;
      this.stepLogin = 1;
    } else if (version === 'new_password') {
      this.showPasswordInput = false;
      this.showUpdatePassword = true;
      this.showPhoneInput = false;
      this.showPhoneCode = false;
      this.showConfirmResetPassword = false;
      this.showResetPassword = false;
      this.stepLogin = 2;
    } else if (version === 'v3') {
      this.showPasswordInput = true;
      this.showUpdatePassword = false;
      this.showPhoneInput = false;
      this.showPhoneCode = false;
      this.showConfirmResetPassword = false;
      this.showResetPassword = false;
      this.stepLogin = 2;
    } else if (version === 'input_phone') {
      this.showPasswordInput = false;
      this.showUpdatePassword = false;
      this.showPhoneInput = true;
      this.showPhoneCode = false;
      this.showResetPassword = false;
      this.showConfirmResetPassword = false;
      this.stepLogin = 1;
    } else if (version === 'confirm_reset_password') {
      this.showPasswordInput = false;
      this.showUpdatePassword = false;
      this.showPhoneInput = false;
      this.showPhoneCode = false;
      this.showConfirmResetPassword = true;
      this.showResetPassword = false;
      this.stepLogin = 1;
    } else if (version === 'send_code_to_reset_password') {
      this.showPasswordInput = false;
      this.showUpdatePassword = false;
      this.showPhoneInput = false;
      this.showPhoneCode = true;
      this.showPhoneCodeText = true;
      this.showConfirmResetPassword = false;
      this.showResetPassword = false;
      this.stepLogin = 1;
    } else if (version === 'reset_password') {
      this.showPasswordInput = false;
      this.showUpdatePassword = false;
      this.showPhoneInput = false;
      this.showPhoneCode = false;
      this.showPhoneCodeText = false;
      this.showConfirmResetPassword = false;
      this.showResetPassword = true;
      this.stepLogin = 1;
    }
  }

  confirmPhoneCode(data: {phoneCode: number, email: string}) {
    this.loaderService.presentLoading();

    this.phoneCode = data.phoneCode;
    this.email = data.email;

    this.authService.verifyEmailValidationCode(this.form.get("email").value, this.phoneCode).subscribe(data => {
      if (data) {
        this.token = data.token;
        this.showBlock('new_password');
      } else {
        this.toastService.presentError('bad_confirmation_code', 'top');
      }
      this.loaderService.dismiss();
    });
  }

  setEmail(email: string) {
    this.form.controls['email'].setValue(email);
  }

  close() {
    this.modalCtr.dismiss().then(() => {});
  }

  confirmUpdatePassword(password) {
    this.loaderService.presentLoading();
    this.password = password;
    const userId = this.httpService.extractUserIdFromToken(this.token);
    const user: User = {
      id: userId,
      plainPassword: password,
      password: password
    };
    this.authService.updatePasswordUser(userId, user, this.token)
      .subscribe(() => {
        this.form.controls['password'].setValue(password);
        this.toastService.presentSuccess('new_password_update_success');
        this.confirmPassword();
      });
  }

  async goToSignUp() {
    this.event.emit(this.form.get('email').value);
  }

}
