import { SharedComponentsModule } from './../../../components/_shared-components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingSportConfirmRoutingModule } from './booking-sport-confirm-routing.module';

import { BookingSportConfirmPage } from './booking-sport-confirm.page';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {ManageMethodModule} from '../../../components/payments/manage-method/manage-method.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BookingSportConfirmRoutingModule,
        TranslateModule,
        PipesModule,
        ManageMethodModule,
        SharedComponentsModule
    ],
    exports: [],
    declarations: [BookingSportConfirmPage]
})
export class BookingSportConfirmModule {}
