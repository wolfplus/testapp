import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ParamsComponent} from './params.component';
import {ParamsRoutingModule} from './params-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ParamsRoutingModule,
        DefaultHeaderModule
    ],
    exports: [
        ParamsComponent
    ],
    declarations: [
        ParamsComponent
    ]
})
export class ParamsModule {}
