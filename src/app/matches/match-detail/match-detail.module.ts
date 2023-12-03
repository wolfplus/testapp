import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatchDetailComponent } from './match-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { EventDetailHeaderModule } from 'src/app/club/components/event-detail-header/event-detail-header.module';
import { ActivityLevelsModule } from 'src/app/components/activity-levels/activity-levels.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { EventAttendersModule } from 'src/app/club/components/event-attenders/event-attenders.module';
import { SvgContainerModule } from 'src/app/components/svg-container/svg-container.module';
import { ClubDistanceModule } from 'src/app/components/club-distance/club-distance.module';
import { MatchJoinModule } from '../match-join/match-join.module';
import { ClubCardModule } from 'src/app/components/club-card/club-card.module';
import { AvatarNameModule } from 'src/app/components/avatar-name/avatar-name.module';
import { MatchCancelModule } from '../match-cancel/match-cancel.module';
import { MatchShareModule } from 'src/app/components/match-share/match-share.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EventDetailHeaderModule,
    PipesModule,
    TranslateModule,
    ActivityLevelsModule,
    EventAttendersModule,
    SvgContainerModule,
    ClubDistanceModule,
    MatchJoinModule,
    ClubCardModule,
    AvatarNameModule,
    MatchCancelModule,
    MatchShareModule
  ],
  declarations: [MatchDetailComponent]
})
export class MatchDetailModule {}
