import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyCreditsComponent} from './my-credits.component';
import {MyCreditsRoutingModule} from './my-credits-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '../../shared/pipes/pipes.module';
import { CreditDetailsComponent } from './credit-details/credit-details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyCreditsRoutingModule,
        DefaultHeaderModule,
        TranslateModule.forChild(),
        PipesModule
    ],
    exports: [
        MyCreditsComponent
    ],
    declarations: [
        MyCreditsComponent,
        CreditDetailsComponent
    ]
})
export class MyCreditsModule {}
