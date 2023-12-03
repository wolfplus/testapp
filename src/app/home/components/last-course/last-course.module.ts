import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastCourseComponent } from './last-course.component';
import { CardMyBookingModule } from 'src/app/components/card-my-booking/card-my-booking.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { ClubBookingListPageModule } from 'src/app/club-booking-list/club-booking-list.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CardCoursModule } from 'src/app/club-booking-list/components/card-cours/card-cours.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    CardMyBookingModule,
    PipesModule,
    ClubBookingListPageModule,
    CardCoursModule
  ],
  declarations: [
    LastCourseComponent,
  ],
  exports: [LastCourseComponent]
})
export class LastCourseModule { }
