import {Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, ViewChild} from '@angular/core';
import {AuthService} from "../../shared/services/user/auth.service";
import {ToastService} from "../../shared/services/toast.service";
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import {catchError, tap, first} from "rxjs/operators";

@Component({
  selector: 'app-phone-code',
  templateUrl: './phone-code.component.html',
  styleUrls: ['./phone-code.component.scss']
})
export class PhoneCodeComponent implements OnInit, OnChanges {

  @Input() phoneCode;
  @Input() phoneNumber;
  @Input() showEmail = false;
  @Input() signUp = false;
  @Input() inputType: string;
  @Input() setMail: string;
  @Output() setPhoneCode = new EventEmitter();
  @Output() sendCode = new EventEmitter();
  @Output() sendToEmail = new EventEmitter();
  @Output() nextStep = new EventEmitter();
  @Output() previous = new EventEmitter();
  @ViewChild('code1')  code1Element: ElementRef;
  codeInput1: any;
  @ViewChild('code2')  code2Element: ElementRef;
  codeInput2: any;
  @ViewChild('code3')  code3Element: ElementRef;
  codeInput3: any;
  @ViewChild('code4')  code4Element: ElementRef;
  codeInput4: any;

  emailCounter = 60;
  submited = false;
  emailEnable = false;

  showEmailInput: boolean;
  email: string = '';
  disableCode: boolean = true;

  constructor(private authService: AuthService,
              private toastService: ToastService,       
              private loaderService: LoaderService,
              ) { }

  ngOnInit(): void {
    this.email = this.setMail ? this.setMail : '';
    this.decrementCount();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.showEmail) {
      this.codeInput1 = '';
      this.codeInput2 = '';
      this.codeInput3 = '';
      this.codeInput4 = '';
    }
  }

  confirm() {
    if(isNaN(this.codeInput1) || isNaN(this.codeInput2) || isNaN(this.codeInput3) || isNaN(this.codeInput4)) {
      return;
    }
    this.phoneCode = this.codeInput1 + '' + this.codeInput2 + '' + this.codeInput3 + '' + this.codeInput4;
    this.setPhoneCode.emit({phoneCode: this.phoneCode, email: this.email});
  }

  resendConfirm() {
    if(this.emailCounter !== 0) {
      return;
    }
    this.toastService.presentSuccess('resended_confirm_code', 'top');
    if(this.signUp || this.inputType === 'phone') {
      this.confirmEmail();
    } else {
      this.sendCode.emit(true);
    }
  }

  async confirmEmail() {
    this.submited = true;
    // test
    if(this.email === '') {
      return;
    }
    this.email.toLowerCase();
    this.email = this.email.replace(/\s/g,'');
    if (this.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null) {
      await this.loaderService.presentLoading();
      this.authService.checkIfUserExists(this.email).pipe(tap(resp => {
        this.loaderService.dismiss();
        if ((this.signUp && !resp.exist) || (!this.signUp && resp.exist)) {
          this.loaderService.presentLoading();
          this.authService.getEmailValidationIntent(this.email, this.inputType === 'phone' ? this.phoneNumber : null)
              .pipe(first())
              .subscribe({
                next: (payload: any) => {
                  if(payload) {
                    this.sendToEmail.emit(this.email);
                    this.loaderService.dismiss();
                    this.showEmail = false;
                  }
                },
                error: (error: string) => {
                  this.showEmail = true;
                  return this.toastService.presentError(error['hydra:description'], 'top');
                }
              });
        } else {
          if(this.signUp) {
            this.toastService.presentError('validation_message_not_a_existing_email', 'top');

          } else {
            this.toastService.presentError('user_not_found_email', 'top');
          }
        }
      }), catchError(err => {
        this.loaderService.dismiss();
        return err;
      })).toPromise().then(() => {
        this.loaderService.dismiss();
      }).catch(() => {
        this.loaderService.dismiss();
      });
    } else {
      this.loaderService.dismiss();
      this.toastService.presentError('validation_message_not_a_valid_email', 'top');
    }
  }

  goBack() {
    this.codeInput1 = '';
    this.codeInput2 = '';
    this.codeInput3 = '';
    this.codeInput4 = '';
    this.previous.emit(true);
    if(this.signUp) {
      this.showEmail = true;
    }
  }

  changeInput(event, input: string) {
    console.log(event.key, input);
    if(event.target.value.length > 1) {
      event.target.value = event.target.value.substring(0, event.target.value.length - 1);
    }
    if (event.key === 'Meta') {
      this.disableCode = true;
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
      if(event.key !== 'Backspace') {
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

    if(isNaN(this.codeInput1) || isNaN(this.codeInput2) || isNaN(this.codeInput3) || isNaN(this.codeInput4) || this.codeInput1 === '' || this.codeInput2 === '' || this.codeInput3 === '' || this.codeInput4 === '') {
      this.disableCode = true;
    } else {
      this.disableCode = false;
    }
  }
  
  deleteInput(input: string) {
    switch (input) {
      case 'code2':
        this.code1Element.nativeElement.focus();
        break;
      case 'code3':
        this.code2Element.nativeElement.focus();
        break;
      case 'code4':
        this.code3Element.nativeElement.focus();
        break;
    }
  }

  showInputEmail() {
    if (this.emailEnable) {
      this.showEmail = true;
    }
  }

  decrementCount() {
    setTimeout(() => {
      this.emailCounter--;
      if (this.emailCounter !== 0) {
        this.decrementCount();
      } else {
        this.emailEnable = true;
      }
    }, 1000);
  }
}
