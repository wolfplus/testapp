import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyConsumptionComponent} from './my-consumption.component';
import {MyConsumptionRoutingModule} from './my-consumption-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '../../shared/pipes/pipes.module';
import { DetailsConsumptionComponent } from './details/details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyConsumptionRoutingModule,
        DefaultHeaderModule,
        TranslateModule.forChild(),
        PipesModule
    ],
    exports: [
        MyConsumptionComponent
    ],
    declarations: [
        MyConsumptionComponent,
        DetailsConsumptionComponent
    ]
})
export class MyConsumptionModule {}
