import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {CardMyBookingComponent} from './card-my-booking.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {BookingSportConfirmModule} from '../../modal/booking/booking-sport-confirm/booking-sport-confirm.module';
import { ActivityLevelsModule } from '../activity-levels/activity-levels.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from '../_shared-components/shared-components.module';
import { LazyImageModule } from 'src/app/shared/lazy-img/lazy-img.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        PipesModule,
        BookingSportConfirmModule,
        ActivityLevelsModule,
        TranslateModule,
        LazyImageModule,
        SharedComponentsModule
    ],
    declarations: [
        CardMyBookingComponent
    ],
    exports: [
        CardMyBookingComponent
    ]
})

export class CardMyBookingModule {}
