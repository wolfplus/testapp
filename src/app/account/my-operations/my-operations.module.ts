import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyOperationsComponent} from './my-operations.component';
import {MyOperationsRoutingModule} from './my-operations-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyOperationsRoutingModule,
        TranslateModule.forChild(),
        DefaultHeaderModule
    ],
    exports: [
        MyOperationsComponent
    ],
    declarations: [
        MyOperationsComponent
    ]
})
export class MyOperationsModule {}
