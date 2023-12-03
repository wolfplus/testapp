import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastBookingComponent } from './last-booking.component';
import { CardMyBookingModule } from 'src/app/components/card-my-booking/card-my-booking.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    CardMyBookingModule
  ],
  declarations: [LastBookingComponent],
  exports: [LastBookingComponent]
})
export class LastBookingModule { }
