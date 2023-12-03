import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ErrorApiRoutingModule } from './error-api-routing.module';
import { ErrorApiComponent } from './error-api.component';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    declarations: [
        ErrorApiComponent
    ],
    exports: [
        ErrorApiComponent
    ],
    imports: [
        CommonModule,
        ErrorApiRoutingModule,
        TranslateModule,
        IonicModule
    ]
})
export class ErrorApiModule { }
