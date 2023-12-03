import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ManageMethodComponent} from './manage-method.component';
import {CardModule} from '../card/card.module';
import {CreditModule} from '../credit/credit.module';
import {OrangeMoneyModule} from '../orange-money/orange-money.module';
import {SpotModule} from '../spot/spot.module';
import {WalletModule} from '../wallet/wallet.module';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import { BottomModalModule } from '../../bottom-modal/bottom-modal.module';
import { EPayModule } from '../e-pay/e-pay.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        CardModule,
        CreditModule,
        OrangeMoneyModule,
        SpotModule,
        WalletModule,
        PipesModule,
        BottomModalModule,
        SharedComponentsModule,
        EPayModule
    ],
    declarations: [
        ManageMethodComponent
    ],
    exports: [
        ManageMethodComponent
    ]
})

export class ManageMethodModule {}
