import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {InformationsComponent} from './informations.component';
import {InformationsRoutingModule} from './informations-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InformationsRoutingModule,
        DefaultHeaderModule,
        TranslateModule.forChild()
    ],
    exports: [
        InformationsComponent
    ],
    declarations: [
        InformationsComponent
    ]
})
export class InformationsModule {}
