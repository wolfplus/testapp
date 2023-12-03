import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyPaymentTypeComponent} from './my-payment-type.component';
import {MyPaymentTypeRoutingModule} from './my-payment-type-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {CardModule} from '../../components/payments/card/card.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyPaymentTypeRoutingModule,
        DefaultHeaderModule,
        TranslateModule.forChild(),
        CardModule
    ],
    exports: [
        MyPaymentTypeComponent
    ],
    declarations: [
        MyPaymentTypeComponent
    ]
})
export class MyPaymentTypeModule {}
