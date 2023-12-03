import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {CardClubModule} from '../../components/card-club/card-club.module';
import {TranslateModule} from '@ngx-translate/core';
import {PasswordComponent} from './password.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DefaultHeaderModule,
        TranslateModule.forChild(),
        CardClubModule
    ],
    exports: [
        PasswordComponent
    ],
    declarations: [
        PasswordComponent
    ]
})
export class PasswordModule {}
