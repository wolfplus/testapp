import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {DefaultHeaderModule} from '../../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {BookingSportConfirmModule} from '../booking-sport-confirm/booking-sport-confirm.module';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import { BookingAttendersModule } from 'src/app/components/booking-attenders/booking-attenders.module';
// import {BookingAttendersComponent} from '../../../components/booking-attenders/booking-attenders.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        DefaultHeaderModule,
        TranslateModule,
        BookingSportConfirmModule,
        PipesModule,
        BookingAttendersModule
    ],
    declarations: [],
    exports: []
})

export class BookingAttenderPaymentModule {}
