import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {InformationsAccountComponent} from './informations-account.component';
import {SignModule} from "../../../modal/auth/sign/sign.module";
import { PasswordModalComponent } from './password-modal/password-modal.component';
import { SelectLocaleModule } from 'src/app/components/select-locale/select-locale.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        SignModule,
        SelectLocaleModule
    ],
    exports: [
        InformationsAccountComponent
    ],
    declarations: [InformationsAccountComponent, PasswordModalComponent]
})
export class InformationAccountModule {}
