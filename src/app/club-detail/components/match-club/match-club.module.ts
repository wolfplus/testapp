import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchClubComponent } from './match-club.component';
import { FiltersBookingModule } from 'src/app/components/filters-booking/filters-booking.module';
import { MatchCardModule } from '../../../components/match-card/match-card.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FiltersBookingModule,
    MatchCardModule,
    TranslateModule,
    IonicModule,
  ],
  declarations: [MatchClubComponent],
  exports: [MatchClubComponent]
})
export class MatchClubModule { }
