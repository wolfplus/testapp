import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import intlTelInput from 'intl-tel-input';
import {catchError, tap} from 'rxjs/operators';
import {LoaderService} from '../../shared/services/loader/loader.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../shared/services/user/auth.service';
import {UserService} from '../../shared/services/storage/user.service';
import {ToastService} from '../../shared/services/toast.service';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss']
})
export class PhoneNumberComponent implements OnInit, AfterViewInit {

  phoneCode;
  @ViewChild('code1')  code1Element: ElementRef;
  codeInput1: number;
  @ViewChild('code2')  code2Element: ElementRef;
  codeInput2: number;
  @ViewChild('code3')  code3Element: ElementRef;
  codeInput3: number;
  @ViewChild('code4')  code4Element: ElementRef;
  codeInput4: number;


  phoneNumber: string;
  errorPhoneMessage: string;
  showCode = false;
  errorPhone = false;
  iti: any;
  constructor(
    private modalCtrl: ModalController,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const input = document.querySelector("#phone");
    this.iti = intlTelInput(input, {
      customPlaceholder: function(selectedCountryPlaceholder, _selectedCountryData) {
        return "e.g. " + selectedCountryPlaceholder;
      },
      initialCountry: 'fr',
      onlyCountries: ['ae', 'be', 'ch', 'ci', 'de', 'es', 'fr', 'gb', 'gp', 'it', 'lu', 'mq', 'nl', 'pt', 're', 'sn', 'mu', 'gf', 'th', 'se', 'mc', 'ma', 'nc', 'mg', 'dz', 'pl'],
      utilsScript: 'js/utils.js'
    });
  }

  confirmCode() {
  }

  sendPhone() {
    this.phoneNumber = this.iti.getNumber();
    if (this.iti.getValidationError() > 0) {
      this.errorPhoneMessage = this.translate.instant('user_phone_not_valid');
      this.errorPhone = true;
    } else {
      this.loaderService.presentLoading();
      this.errorPhoneMessage = '';
      this.errorPhone = false;
      this.authService.checkIfUserExists(this.phoneNumber).pipe(tap(resp => {
        if (resp.exist) {
          this.errorPhoneMessage = this.translate.instant('user_already_exist');
          this.errorPhone = true;
        } else {
          this.authService.getPhoneNumberValidationCode(this.phoneNumber).subscribe(data => {
            if (data) {
              this.showCode = true;
            }
          });
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
  }

  close() {
    this.modalCtrl.dismiss({refresh: true}).then();
  }

  confirmTapeCode() {
    this.loaderService.presentLoading();
    this.phoneCode = this.codeInput1 + '' + this.codeInput2 + '' + this.codeInput3 + '' + this.codeInput4;
    this.authService.verifyPhoneNumberValidationCode(this.phoneNumber, this.phoneCode).subscribe(data => {
      if (data) {
        this.userService.get().subscribe(resp => {
          if (resp) {
            this.authService.updateUser(resp.id, {phoneNumber: this.phoneNumber});

            // TODO : add success message
            this.toastService.presentSuccess('update_phone_number_success');
            this.close();
          }
          this.loaderService.dismiss();
        });
      }
    });
  }

  changeInput(event, input: string) {
    if (event.key === 'Meta') {
      let digitString = '';
      switch (input) {
        case 'code1':
          digitString = '' + this.codeInput1;
          break;
        case 'code2':
          digitString = '' + this.codeInput1;
          break;
        case 'code3':
          digitString = '' + this.codeInput1;
          break;
        case 'code4':
          digitString = '' + this.codeInput1;
          break;
      }

      const array = digitString.split('');
      array.forEach((item, i) => {
        switch (i) {
          case 0:
            this.codeInput1 = parseInt(item, null);
            break;
          case 1:
            this.codeInput2 = parseInt(item, null);
            break;
          case 2:
            this.codeInput3 = parseInt(item, null);
            break;
          case 3:
            this.codeInput4 = parseInt(item, null);
            break;
        }
      });
    } else {
      switch (input) {
        case 'code1':
          if (this.codeInput1 !== null && this.codeInput1 !== undefined) {
            this.code2Element.nativeElement.focus();
          }
          break;
        case 'code2':
          if (this.codeInput2 !== null && this.codeInput2 !== undefined) {
            this.code3Element.nativeElement.focus();
          }
          break;
        case 'code3':
          if (this.codeInput3 !== null && this.codeInput3 !== undefined) {
            this.code4Element.nativeElement.focus();
          }
          break;
      }
    }
  }

  deleteInput(input: string) {
    switch (input) {
      case 'code2':
        this.codeInput2 = null;
        this.code1Element.nativeElement.focus();
        break;
      case 'code3':
        this.codeInput3 = null;
        this.code2Element.nativeElement.focus();
        break;
      case 'code4':
        this.codeInput4 = null;
        this.code3Element.nativeElement.focus();
        break;
      case 'code1':
        this.codeInput1 = null;
        break;
    }
  }
}
