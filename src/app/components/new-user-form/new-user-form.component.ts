import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { User } from '../../shared/models/user';
import { AlertController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { PhotoService } from 'src/app/shared/services/photo.service';
import * as moment from 'moment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {catchError, filter, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { OneSignalServiceService } from 'src/app/shared/services/oneSignal/one-signal-service.service';
import { AuthService } from 'src/app/shared/services/user/auth.service';
import { UserTokenService } from 'src/app/shared/services/storage/user-token.service';
import * as UserActions from '../../state/actions/user.actions';
import { Router } from '@angular/router';
import intlTelInput from 'intl-tel-input';
import {EnvironmentService} from "../../shared/services/environment/environment.service";
import * as AccountActions from "../../account/store/account.actions";

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.scss'],
  providers: []
})
export class NewUserFormComponent implements OnInit, AfterViewInit {
  @ViewChild('phoneInput') phoneInput: ElementRef;
  @Input() phoneNumber: string;
  @Input() token: string;
  @Input() email?: string;

  form: UntypedFormGroup;
  PHOTO_STORAGE = 'avatar';
  imageAvatar: any;
  phoneNumberError = false;
  avatarTmp: any;
  error = false;
  errors: any;
  maxDate: string;
  iti: any;
  showPassword: boolean = false;
  env;

  requiredField = this.translateService.instant('required_field');
  submitAttempt = false;

  validationMessages = {
      firstName: [
          {type: 'required', message: this.requiredField},
          {type: 'minlength', message: this.translateService.instant('input_min_3_Length')}
      ],
      lastName: [
          {type: 'required', message: this.requiredField},
          {type: 'minlength', message: this.translateService.instant('input_min_3_Length')}
      ],
      email: [
          {type: 'required', message: this.requiredField}
      ],
      password: [
        {type: 'required', message: this.requiredField},
        {type: 'server', message: this.requiredField},
        {type: 'minlength', message: this.translateService.instant('password_min_characters')}
      ]
  };

  constructor(
    public alertController: AlertController,
    public domSanitizer: DomSanitizer,
    private photoService: PhotoService,
    private sanitizer: DomSanitizer,
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService,
    private accountStore: Store<any>,
    private loaderService: LoaderService,
    private appStore: Store<AppState>,
    private oneSignalService: OneSignalServiceService,
    private authService: AuthService,
    private userToken: UserTokenService,
    private modalCtr: ModalController,
    private router: Router,
    private environmentService: EnvironmentService,
  ) {
    this.env = this.environmentService.getEnvFile();
    // this.initErrors();
    this.imageAvatar = 'assets/images/avatar.png';
    this.maxDate = moment(new Date()).subtract(10, 'years').format().toString();

    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [this.email, [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: [{value: this.email, disabled: true}, [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.photoService.avatarAsBlob$
      .subscribe( avatarObject => {
        if (avatarObject !== null) {
          const objectURL = 'data:image/jpeg;base64,' + avatarObject.base64String;
          this.imageAvatar = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        } else {
          this.imageAvatar = 'assets/images/avatar.png';
        }
      });
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
  }

  handleFormError(form: UntypedFormGroup, errors){
    const violations = typeof errors['error'] !== 'undefined' ?  errors['error']['violations'] || null : null;
    if (violations && violations.constructor === Array){
      // tslint:disable-next-line: forin
      for (const key in violations){
        const item = violations[key];
        if (form.contains(item['propertyPath'])){
          form.controls[item['propertyPath']].setErrors({
            serverSide: item['message']
        });
        } else if(item['propertyPath'] === 'phoneNumber') {
          this.phoneNumberError = true;
        }
      }
    } else {
        // this.handleError(errors);
    }
  }

  sanitize(objectURL) {
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  addAvatar() {
    this.photoService.changeAvatar('signUp');
  }

  onSubmit() {
    this.submitAttempt = true;
    if (this.form.valid) {
      const user: User = {
        id: null,
        email: this.form.get("email").value !== "" ? this.form.get("email").value : null,
        firstName: this.form.get("firstName").value,
        lastName: this.form.get("lastName").value,
        phoneNumber: this.iti.getNumber(),
        plainPassword: this.form.get("password").value,
      };
      this.confirmUserForm(user);
    }
  }

  confirmUserForm(user: User) {
    this.loaderService.presentLoading();
    this.authService.signupUser(user, this.token, {observe: 'response'})
    .pipe(
      catchError( errors => {
        this.loaderService.dismiss();
        this.handleFormError(this.form, errors);
        return of(console.error("signupUser error: ", JSON.stringify(errors, null, 4)));
      })
    )
    .subscribe(resp => {
      this.loaderService.dismiss();
      if (resp !== undefined) {
        this.appStore.dispatch(new UserActions.AddUser(resp as User));
        this.signUp(user);
      }
    });
  }

  signUp(data) {
    this.loaderService.presentLoading();

    this.authService.signInUser(this.iti.getNumber(), data.plainPassword)
      .pipe(
        filter(resp => resp !== undefined),
        // switchMap( resp => {
        //   return from(this.userToken.add(resp));
        // }),
        tap(tokens => {
          // TODO : There add OneSignalService.AddOneSignal
          if (tokens) {
            this.userToken.add(tokens).then(() => {
              this.authService.getConnectedUser()
                .subscribe(async (data) => {
                  await this.accountStore.dispatch(AccountActions.setMe({ data }));
                  setTimeout( _ => {
                    this.oneSignalService.addOnesignalIdUser();
                  }, 2000);
                  // this.oneSignalService.addOnesignalIdUser();
                  this.loaderService.dismiss();
                  const currentUrl = this.router.url;
                  this.router.navigate(['/account/me'], {skipLocationChange: true}).then(() => {
                    this.router.navigateByUrl(`${currentUrl}`);
                  });
                });
            }).catch(() => {
              this.loaderService.dismiss();
            });
          } else {
            this.loaderService.dismiss();
          }
        }),
        switchMap( _ => {
          return this.photoService.avatarAsBlob$;
        }),
        /* tap(avatar => {
          this.loaderService.dismiss();
        }), */
        switchMap( avatarAsBlobObject => {

          if (avatarAsBlobObject) {
            // tslint:disable-next-line: max-line-length
            return this.photoService.uploadPic(avatarAsBlobObject.blob, avatarAsBlobObject.imageName, avatarAsBlobObject.capturedPhotoFormat);
          } else {
            return of(undefined);
          }
        })
      )
      .subscribe(() => {
        // TODO : There add OneSignalService.AddOneSignal
        setTimeout( _ => {
          this.oneSignalService.addOnesignalIdUser();
        }, 2000);
        this.loaderService.dismiss();
        this.close();
      });
  }

  close() {
    this.modalCtr.dismiss('close');
  }

  previous() {
    this.modalCtr.dismiss("previous");
  }

}


