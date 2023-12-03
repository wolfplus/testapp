import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.scss']
})
export class PasswordUpdateComponent implements OnInit {
  @Output() confirm = new EventEmitter();

  password: string;
  passwordConfirm: string;
  form: UntypedFormGroup;
  submitAttempt = false;

  validationMessages = {
    password: [
      { type: 'mismatch', message: this.translate.instant('validation_messages.password_do_not_match') },
      { type: 'required', message: this.translate.instant('validation_messages.required') },
      { type: 'minlength', message: this.translate.instant('password_min_characters') }
    ]
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: UntypedFormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      changePassword: this.formBuilder.group({
        password: new UntypedFormControl(
          '',
          {
            validators: Validators.compose([Validators.required, Validators.minLength(8)]),
            updateOn: 'blur'
          }
        ),
        repeat: new UntypedFormControl('',
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'change'
          }
        )
      },
      { validators: this.passwordMatchValidator.bind(this), updateOn: 'change' }
      )
    });
  }

  passwordMatchValidator(group: UntypedFormGroup) {
    /* if (group.get('repeat').value.length >= 8) {
      if (!group.get('password').value || !group.get('repeat').value) {
        return null;
      }
      return group.get('password').value === group.get('repeat').value ? null : { mismatch: true };
    } */
    if (!group.get('password').value || !group.get('repeat').value) {
      return null;
    }
    return group.get('password').value === group.get('repeat').value ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.confirm.emit(this.form.value.changePassword.password);
    } else {
      return;
    }
  }
}
