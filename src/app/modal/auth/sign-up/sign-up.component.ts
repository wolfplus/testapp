import {AfterViewInit, Component, ChangeDetectorRef, ElementRef, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ConfigService } from '../../../config/config.service';
import { AuthService } from '../../../shared/services/user/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import intlTelInput from 'intl-tel-input';
import { LoaderService } from '../../../shared/services/loader/loader.service';

import { fromEvent, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { getSecondaryColor } from 'src/utils/getSecondaryColor';

import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import { Keyboard } from '@capacitor/keyboard';
import { NewUserFormComponent } from 'src/app/components/new-user-form/new-user-form.component';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, AfterViewInit {
  @ViewChild('phoneInput') phoneInput: ElementRef;
  @Output() public event: EventEmitter<void> = new EventEmitter<void>();
  @Input() public setMail;

  PHOTO_STORAGE = "avatar";
  env;
  initialCountryCode = "fr";
  phoneNumber: string;
  selectedCountry: string;
  separateDialCode: boolean;
  SearchCountryField: any;
  TooltipLabel: any;
  CountryISO: any;
  preferredCountries: Array<any>;
  phoneForm: any;
  logoUrl: string;
  errorPhone: boolean;
  errorPhoneMessage: string;
  password: string;
  stepLogin: number;
  showPhoneCode: boolean;
  phoneCode: number;
  code_text: string = "";
  email : string | undefined = undefined;
  showPhoneInput: boolean;
  showEmailInput: boolean;
  showUseForm: boolean;
  token: string;
  iti: any;
  isFocus: boolean;
  codeTextshow: boolean;
  showEmail = true;
  errorUserForm = {
    error: false,
    message: ''
  };

  welcome = '';
  passwordImage = '';
  secondaryColorIsWhite: boolean;

  constructor(
    private config: ConfigService,
    private authService: AuthService,
    public translate: TranslateService,
    private loaderService: LoaderService,
    private environmentService: EnvironmentService,
    private toastService: ToastService,
    private modalController: ModalController,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.env = this.environmentService.getEnvFile();
    this.isFocus = false;
    this.showBlock('input_email');
    // this.showBlock('user_form');
    this.selectedCountry = '33';
    this.stepLogin = 1;
    this.logoUrl = this.config.getLogoUrl();
    this.separateDialCode = false;
    this.phoneForm = new UntypedFormGroup({
      phone: new UntypedFormControl(undefined, [Validators.required])
    });
    this.errorPhone = false;
    this.errorPhoneMessage = '';
    this.initialCountryCode = this.env.defaultPhoneLang;
    this.welcome = 'assets/images/illustrations' + (this.env.useMb ? ('_' + this.env.marqueBlanche.pathName) : '')  + '/welcome.svg';
    this.passwordImage = 'assets/images/illustrations' + (this.env.useMb ? ('_' + this.env.marqueBlanche.pathName) : '')  + '/create_password.svg';
  }

  ngOnInit(): void {
    this.email = this.setMail ? this.setMail : '';
    if (window.origin.includes('capacitor://')) {
      Keyboard.addListener('keyboardWillShow', () => {
      });
    }
    const secondaryColor = getSecondaryColor();
    if (secondaryColor && secondaryColor === 'ffffff') {
      this.secondaryColorIsWhite = true;
    } else {
      this.secondaryColorIsWhite = false;
    }
  }

  ngAfterViewInit() {
    const input = document.querySelector("#phoneUp");
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

    fromEvent(this.phoneInput.nativeElement, 'keyup')
      .pipe(
        map( () => {
          return this.phoneInput.nativeElement.value;
        }),
        tap( () => {
          this.errorPhoneMessage = '';
        }),
       /*  filter(Boolean),
        filter((event: any) => event.length > 9),
        debounceTime(500),
        distinctUntilChanged(),
        tap( phoneNumber => {
          this.errorPhoneMessage = '';
          this.requestPhoneCode(true);
        }) */
      ).subscribe();
  }


  updateUrlWelcome() {
    this.welcome = 'assets/images/logos/icon_doin.png';
  }

  updateUrlPassword() {
    this.passwordImage = 'assets/images/logos/icon_doin.png';
  }

  phoneChange(event) {
    this.phoneNumber = event.target.value;
    this.errorPhoneMessage = '';
    this.errorPhone = false;
  }

  passwordChange() {
    this.errorPhoneMessage = '';
    this.errorPhone = false;
  }

  countryChange(event) {
    this.selectedCountry = event.dialCode;
    this.errorPhoneMessage = '';
    this.errorPhone = false;
  }

  // validatePhoneNumber() {
  //   // alert("event: " + event );
  //   // this.requestPhoneCode();
  // }

  requestPhoneCode(waitBeforeSending = false) {
    this.errorPhoneMessage = '';
    if (waitBeforeSending === false) {
      this.loaderService.presentLoading();
    }
    this.phoneNumber = this.iti.getNumber();
    if (this.phoneNumber === '' || this.phoneNumber === undefined) {
      this.errorPhoneMessage = this.translate.instant('user_phone_not_valid');
      this.errorPhone = true;
    } else {
      const phoneFormated = this.phoneNumber;
      this.authService.checkIfUserExists(phoneFormated)
        .pipe(
          tap( () => {
            this.loaderService.dismiss();
          }),
          filter( user => user !== undefined),
          tap( user => {
            if (user.exist) {
              this.errorPhone = true;
              this.errorPhoneMessage = this.translate.instant('phone_number_already_used');
            }
          }),
          switchMap( user => {
            if (!user.exist) {
              return this.authService.getPhoneNumberValidationCode(phoneFormated)
                .pipe(
                  tap(resp => {
                    this.loaderService.dismiss();
                    if (resp !== undefined && waitBeforeSending === false) {
                      this.errorPhoneMessage = "";
                      this.showBlock('code_sms');
                    } else if (resp !== undefined && waitBeforeSending === true) {
                      this.errorPhoneMessage = "";
                    } else {
                      this.errorPhoneMessage = this.translate.instant('user_phone_not_valid');
                    }
                  })
                );
            }
            return of();
          }),
          catchError( () => of(this.loaderService.dismiss()))
        )
        .subscribe(() => {});
    }
  }

  showBlock(version) {
    if (version === 'user_form') {
      // this.showPhoneInput = false;
      // this.showEmailInput = false;
      // this.showPhoneCode = false;
      // this.showUseForm = true;
      this.close();
      this.modalController.create({
          component: NewUserFormComponent,
          componentProps: {
              phoneNumber: this.phoneNumber,
              token: this.token,
              email: this.email
          },
          cssClass: 'sign-class',
          swipeToClose: true,
          backdropDismiss: true,
          mode: 'ios'
        })
        .then(mod => {
            mod.present();
            mod.onWillDismiss().then( data => {
              console.log(data, "ici data <====")
              if(data.data === 'previous') {
                this.resetCode();
              } else if(data.data === 'close') {
                this.close();
              }
            });
            // return mod.onWillDismiss().then(() => {
            //     this.close();
            // });
        });
      this.stepLogin = 2;
    } else if (version === 'code_sms') {
      this.showEmailInput = false;
      this.showPhoneInput = false;
      this.showPhoneCode = true;
      this.showUseForm = false;
      this.stepLogin = 1;
    } else if (version === 'input_email') {
      this.showPhoneInput = false;
      this.showEmailInput = true;
      this.showPhoneCode = false;
      this.showUseForm = false;
      this.stepLogin = 1;
    } else if (version === 'input_phone') {
      this.showEmailInput = false;
      this.showPhoneInput = true;
      this.showPhoneCode = false;
      this.showUseForm = false;
      this.stepLogin = 1;
    }
  }

  resetCode() {
    this.showEmail = false;
    this.changeDetector.detectChanges();
    this.showEmail = true;
  }

  codeSended(version: string, email: string) {
    this.email = email;
    this.code_text = this.translate.instant('code_subtitle1', { mail: this.email });
    this.codeTextshow = true;
    this.showBlock(version);
  }

  confirmPhoneCode(data: {phoneCode: number, email: string | undefined}) {
    this.loaderService.presentLoading();
    this.phoneCode = data.phoneCode;
    this.email = data.email;

    if (this.email == undefined) {
      this.authService.verifyPhoneNumberValidationCode(this.phoneNumber, this.phoneCode).subscribe(data => {
        if (data) {
          // this.userToken.add(data);
          this.token = data.token;
          this.showBlock('user_form');
        } else {
          this.toastService.presentError('bad_confirmation_code', 'top');
        }
        this.loaderService.dismiss();
      });
    } else {
      this.authService.verifyEmailValidationCode(this.email, this.phoneCode).subscribe(data => {
        if (data) {
          // this.userToken.add(data);
          this.token = data.token;
          this.showBlock('user_form');
        } else {
          this.toastService.presentError('bad_confirmation_code', 'top');
        }
        this.loaderService.dismiss();
      });
    }

  }

  // confirmUserForm(event) {
  //   /* if (!this.loaderService.loading) {
  //     this.loaderService.presentLoading();
  //   } */
  //   this.authService.signupUser(event, this.token)
  //     .pipe(
  //       catchError( errors => {
  //         this.signUpErrorsSub$.next(errors);
  //         return of(console.error("signupUser error: ", JSON.stringify(errors, null, 4)));
  //       })
  //     )
  //     .subscribe(resp => {
  //       this.loaderService.dismiss();
  //       if (resp !== undefined) {
  //         this.appStore.dispatch(new UserActions.AddUser(resp as User));
  //         this.signUp(event);
  //       }
  //     });
  // }

  // signUp(data) {
  //   this.loaderService.presentLoading();

  //   this.authService.signInUser(this.phoneNumber, data.plainPassword)
  //     .pipe(
  //       filter(resp => resp !== undefined),
  //       switchMap( resp => {
  //         return from(this.userToken.add(resp));
  //       }),
  //       switchMap( _ => {
  //         return this.photoService.avatarAsBlob$;
  //       }),
  //       /* tap(avatar => {
  //         this.loaderService.dismiss();
  //       }), */
  //       switchMap( avatarAsBlobObject => {

  //         if (avatarAsBlobObject !== undefined && avatarAsBlobObject !== null) {
  //           // tslint:disable-next-line: max-line-length
  //           return this.photoService.uploadPic(avatarAsBlobObject.blob, avatarAsBlobObject.imageName, avatarAsBlobObject.capturedPhotoFormat);
  //         } else {
  //           return of(null);
  //         }
  //       }),
  //       tap( () => {
  //         // TODO : There add OneSignalService.AddOneSignal
  //         this.oneSignalService.addOnesignalIdUser();
  //         this.loaderService.dismiss();
  //         this.close();
  //       })
  //     )
  //     .subscribe();
  // }

  async goToSignIn() {
    this.event.emit();
  }

  previous() {
    this.codeTextshow = false;
  }

  close() {
    this.modalController.dismiss();
  }

  goToWelcome() {
    this.modalController.dismiss();
    // TODO : Open modal welcome !
  }
}
