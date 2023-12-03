import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingCardShortComponent } from './booking-card-short.component';
import { ActivityLevelsModule } from '../activity-levels/activity-levels.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from '../_shared-components/shared-components.module';


@NgModule({
  imports: [
    CommonModule,
    ActivityLevelsModule,
    PipesModule,
    TranslateModule,
    IonicModule,
    SharedComponentsModule
  ],
  declarations: [BookingCardShortComponent],
  exports: [BookingCardShortComponent]
})
export class BookingCardShortModule { }
