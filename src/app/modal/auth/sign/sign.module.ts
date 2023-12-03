import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignComponent } from './sign.component';
import { SignInModule } from '../sign-in/sign-in.module';
import { SignUpModule } from '../sign-up/sign-up.module';
import { SelectLocaleModule } from 'src/app/components/select-locale/select-locale.module';

@NgModule({
    declarations: [SignComponent],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        SignInModule,
        SignUpModule,
        SelectLocaleModule,
        TranslateModule
    ],
    exports: []
})
export class SignModule {}
