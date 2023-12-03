import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {BookingDetailComponent} from './booking-detail.component';
import {DefaultHeaderModule} from '../../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {BookingSportConfirmModule} from '../booking-sport-confirm/booking-sport-confirm.module';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {BookingAttenderPaymentComponent} from '../booking-attender-payment/booking-attender-payment.component';
import {ManageMethodModule} from '../../../components/payments/manage-method/manage-method.module';
import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';
import { BookingAddUserChoiceModalModule } from 'src/app/components/booking-add-user-choice-modal/booking-add-user-choice-modal.module';
import {BookingAttendersModule} from '../../../components/booking-attenders/booking-attenders.module';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';

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
        ManageMethodModule,
        BookingAddUserChoiceModalModule,
        BookingAttendersModule,
        SharedComponentsModule
    ],
    declarations: [
        BookingDetailComponent,
        BookingAttenderPaymentComponent
    ],
    exports: [
        BookingDetailComponent
    ],
    providers: [Calendar],
})

export class BookingDetailModule {}
