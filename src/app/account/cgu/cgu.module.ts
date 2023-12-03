import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {CardClubModule} from '../../components/card-club/card-club.module';
import {TranslateModule} from '@ngx-translate/core';
import {CguComponent} from './cgu.component';

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
        CguComponent
    ],
    declarations: [
        CguComponent
    ]
})
export class CguModule {}
