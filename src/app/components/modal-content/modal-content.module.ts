import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ModalContentComponent } from './modal-content.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatchCardModule } from '../match-card/match-card.module';
import { ActivityLevelsModule } from '../activity-levels/activity-levels.module';
import { BookingCardShortModule } from '../booking-card-short/booking-card-short.module';
import { StepIndicatorsModule } from '../step-indicators/step-indicators.module';
import { MatchJoinModule } from 'src/app/matches/match-join/match-join.module';
import { AvatarNameModule } from '../avatar-name/avatar-name.module';
import { SvgContainerModule } from '../svg-container/svg-container.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule,
    PipesModule,
    MatchCardModule,
    ActivityLevelsModule,
    BookingCardShortModule,
    StepIndicatorsModule,
    MatchJoinModule,
    AvatarNameModule,
    SvgContainerModule
  ],
  declarations: [ModalContentComponent]
})
export class ModalContentModule {}
