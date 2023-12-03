import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubBookingListPageRoutingModule } from './club-booking-list-routing.module';
import { ClubBookingHeaderComponent } from './components/header/club-booking-header.component';
import { ClubBookingListPage } from './club-booking-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'ion2-calendar';
import { CardPlaygroundComponent } from './components/card-playground/card-playground.component';
import { CardSlotDurationComponent } from './components/card-slot-duration/card-slot-duration.component';
import { TimeChoiceComponent } from './components/time-choice/time-choice.component';
import { FiltrePlaygroundComponent } from './components/filtre-playground/filtre-playground.component';
import { FilterButtonModule } from '../components/filter-button/filter-button.module';
import { DateSelectModule } from './components/date-select/date-select.module';
import { BookingSportConfirmModule } from '../modal/booking/booking-sport-confirm/booking-sport-confirm.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { ActivityLevelsModule } from '../components/activity-levels/activity-levels.module';
import { BookingSuccesModalComponent } from './components/booking-succes-modal/booking-succes-modal.component';
import { FiltreCourseComponent } from './components/filtre-course/filtre-course.component';
import { FiltersCoursePageModule } from './components/filtre-course/filters/filters.module';
import { CourseBookingModule } from './components/course-booking/course-booking.module';
import { ManageMethodModule } from '../components/payments/manage-method/manage-method.module';
import { SelectFriendsModule } from '../components/friends/select-friends/select-friends.module';
import { BookingAddUserChoiceModalModule } from '../components/booking-add-user-choice-modal/booking-add-user-choice-modal.module';
import {CoursePaiementModule} from "./components/paiement/paiement.module";
import { WalletModule } from '../components/payments/wallet/wallet.module';
import {ClassDetailModule} from "./components/class-detail/class-detail.module";
import {ScheduleSportModule} from "../components/schedule-sport/schedule-sport.module";
import { CardCoursModule } from './components/card-cours/card-cours.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ClubBookingListPageRoutingModule,
        TranslateModule,
        CalendarModule,
        FilterButtonModule,
        FiltersCoursePageModule,
        ManageMethodModule,
        DateSelectModule,
        BookingSportConfirmModule,
        PipesModule,
        ActivityLevelsModule,
        SelectFriendsModule,
        BookingAddUserChoiceModalModule,
        CoursePaiementModule,
        WalletModule,
        CourseBookingModule,
        ClassDetailModule,
        ScheduleSportModule,
        CardCoursModule,
    ],
  declarations: [
    ClubBookingListPage,
    ClubBookingHeaderComponent,
    CardPlaygroundComponent,
    CardSlotDurationComponent,
    TimeChoiceComponent,
    FiltrePlaygroundComponent,
    FiltreCourseComponent,
    BookingSuccesModalComponent
  ]
})
export class ClubBookingListPageModule { }
