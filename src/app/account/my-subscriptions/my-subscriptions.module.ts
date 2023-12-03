import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {MySubscriptionsRoutingModule} from './my-subscriptions-routing.module';
import {MySubscriptionsComponent} from './my-subscriptions.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MySubscriptionsRoutingModule,
        DefaultHeaderModule,
        PipesModule,
        TranslateModule.forChild()
    ],
    exports: [
        MySubscriptionsComponent
    ],
    declarations: [
        MySubscriptionsComponent
    ]
})
export class MySubscriptionsModule {}
