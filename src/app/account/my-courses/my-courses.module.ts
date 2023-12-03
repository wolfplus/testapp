import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyCoursesComponent} from './my-courses.component';
import {MyCoursesRoutingModule} from './my-courses-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import { BookingCardShortModule } from 'src/app/components/booking-card-short/booking-card-short.module';
import { CardCoursModule } from 'src/app/club-booking-list/components/card-cours/card-cours.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyCoursesRoutingModule,
        DefaultHeaderModule,
        // CardMyBookingModule,
        BookingCardShortModule,
        TranslateModule,
        CardCoursModule
    ],
    exports: [
        MyCoursesComponent
    ],
    declarations: [
        MyCoursesComponent,
    ]
})
export class MyCoursesModule {}
