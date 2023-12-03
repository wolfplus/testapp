import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SignUpComponent} from './sign-up.component';
import {PhoneCodeModule} from '../../../components/phone-code/phone-code.module';
import {NewUserFormModule} from '../../../components/new-user-form/new-user-form.module';
import {StepsNumberRoundModule} from '../../../components/steps-number-round/steps-number-round.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    declarations: [SignUpComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PhoneCodeModule,
        NewUserFormModule,
        StepsNumberRoundModule,
        TranslateModule
    ],
    exports: [SignUpComponent]
})
export class SignUpModule {}
