import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { EventDetailHeaderModule } from 'src/app/club/components/event-detail-header/event-detail-header.module';
import { CoursePaiementComponent } from './paiement.component';
import {ManageMethodModule} from "../../../components/payments/manage-method/manage-method.module";
import { WalletModule } from 'src/app/components/payments/wallet/wallet.module';
import { FormsModule } from '@angular/forms';
import { PaymentGlobalModule } from 'src/app/shared/payment/payment-global/payment-global.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    FormsModule,
    TranslateModule,
    EventDetailHeaderModule,
    ManageMethodModule,
    WalletModule,
    PaymentGlobalModule
  ],
  declarations: [CoursePaiementComponent]
})
export class CoursePaiementModule {}
