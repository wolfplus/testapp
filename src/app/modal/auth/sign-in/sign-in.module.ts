import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignInComponent } from './sign-in.component';
import {PhoneCodeModule} from '../../../components/phone-code/phone-code.module';
import {PasswordUpdateModule} from '../../../components/password-update/password-update.module';
import {StepsNumberRoundModule} from '../../../components/steps-number-round/steps-number-round.module';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    declarations: [SignInComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PhoneCodeModule,
        PasswordUpdateModule,
        StepsNumberRoundModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    exports: [SignInComponent]
})
export class SignInModule {}
