import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CourseBookingComponent } from './course-booking.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { EventDetailHeaderModule } from 'src/app/club/components/event-detail-header/event-detail-header.module';
import { ManageMethodModule } from 'src/app/components/payments/manage-method/manage-method.module';
import {BookingAddUserChoiceModalModule} from "../../../components/booking-add-user-choice-modal/booking-add-user-choice-modal.module";
import { PaymentGlobalModule } from 'src/app/shared/payment/payment-global/payment-global.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule,
    ManageMethodModule,
    EventDetailHeaderModule,
    BookingAddUserChoiceModalModule,
    PaymentGlobalModule
  ],
  declarations: [CourseBookingComponent]
})
export class CourseBookingModule {}
