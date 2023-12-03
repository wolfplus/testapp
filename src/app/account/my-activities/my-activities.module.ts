import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyActivitiesComponent} from './my-activities.component';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {MyActivitiesRoutingModule} from './my-activities-routing.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DefaultHeaderModule,
        MyActivitiesRoutingModule,
        TranslateModule.forChild()
    ],
    exports: [
        MyActivitiesComponent
    ],
    declarations: [
        MyActivitiesComponent
    ]
})
export class MyActivitiesModule {}
