import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyEventsComponent} from './my-events.component';
import {MyEventsRoutingModule} from './my-events-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyEventsRoutingModule,
        DefaultHeaderModule,
        TranslateModule.forChild()
    ],
    exports: [
        MyEventsComponent
    ],
    declarations: [
        MyEventsComponent
    ]
})
export class MyEventsModule {}
