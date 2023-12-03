import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyBookingsComponent} from './my-bookings.component';
import {MyBookingsRoutingModule} from './my-bookings-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import { BookingCardShortModule } from 'src/app/components/booking-card-short/booking-card-short.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyBookingsRoutingModule,
        DefaultHeaderModule,
        BookingCardShortModule,
        TranslateModule.forChild()
    ],
    exports: [
        MyBookingsComponent
    ],
    declarations: [
        MyBookingsComponent
    ]
})
export class MyBookingsModule {}
