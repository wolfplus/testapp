import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchShellComponent } from './match-shell.component';
import { ScrollHideHeaderModule } from 'src/app/shared/directives/scroll-hide-header.directive.module';
import { IonicModule } from '@ionic/angular';
import { MatchListModule } from '../match-list/match-list.module';
import { HeaderModule } from '../../search-club/components/header/header.module';
import { FiltersBookingModule } from '../../components/filters-booking/filters-booking.module';
import { DateSelectModule } from '../../club-booking-list/components/date-select/date-select.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ScrollHideHeaderModule,
    MatchListModule,
    HeaderModule,
    FiltersBookingModule,
    DateSelectModule,
    TranslateModule
  ],
  declarations: [MatchShellComponent],
  exports: [MatchShellComponent]
})
export class MatchShellModule { }
