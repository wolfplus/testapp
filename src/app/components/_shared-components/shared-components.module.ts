import { HeaderActionsComponent } from './header-actions/header-actions.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import { FullDateComponent } from './full-date/full-date.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';
import {PipesModule} from "../../shared/pipes/pipes.module";
import { EPayModule } from '../payments/e-pay/e-pay.module';
import { StripeComponent } from './stripe/stripe.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        IonicModule,
        FormsModule,
        PipesModule,
        EPayModule
    ],
  declarations: [
    HeaderActionsComponent,
    FullDateComponent,
    StripePaymentComponent,
    StripeComponent
  ],
  exports: [
    HeaderActionsComponent,
    FullDateComponent,
    StripePaymentComponent,
    StripeComponent
  ],
})
export class SharedComponentsModule {}
