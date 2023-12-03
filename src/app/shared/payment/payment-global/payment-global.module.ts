import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentGlobalComponent } from './payment-global.component';
import { PaymentRecapComponent } from './components/payment-recap/payment-recap.component';
import { PaymentSelectionComponent } from './components/payment-selection/payment-selection.component';
import { CreditModalComponent } from './components/payment-selection/credit-modal/credit-modal.component';
import { CreditCardModalComponent } from './components/payment-selection/credit-card-modal/credit-card-modal.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsModalModule } from 'src/app/modal/commons/commons-modal-module';
import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    TranslateModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModalModule,
    // ActivityLevelsModule,
    // SvgContainerModule,
    SharedComponentsModule
  ],
  declarations: [   
    PaymentGlobalComponent,
    PaymentRecapComponent,
    PaymentSelectionComponent,
    CreditModalComponent,
    CreditCardModalComponent
  ],
  exports: [
    PaymentGlobalComponent,
    PaymentRecapComponent,
    PaymentSelectionComponent,
    CreditModalComponent,
    CreditCardModalComponent
  ]
})
export class PaymentGlobalModule { }
