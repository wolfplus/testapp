import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyWalletsComponent} from './my-wallets.component';
import {MyWalletsRoutingModule} from './my-wallets-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DetailsComponent } from './details/details.component';
import { RefillComponent } from './refill/refill.component';
import { CardModule } from 'src/app/components/payments/card/card.module';
import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyWalletsRoutingModule,
        DefaultHeaderModule,
        TranslateModule,
        CardModule,
        PipesModule,
        SharedComponentsModule
    ],
    exports: [
        MyWalletsComponent
    ],
    declarations: [
        MyWalletsComponent,
        DetailsComponent,
        RefillComponent
    ]
})
export class MyWalletsModule {}
