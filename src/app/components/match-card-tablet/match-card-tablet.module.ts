import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MatchCardTabletComponent } from './match-card-tablet.component';
import { ActivityLevelsModule } from '../activity-levels/activity-levels.module';
import { EventAttenderAvatarModule } from '../../club/components/event-attender-avatar/event-attender-avatar.module';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { ClubDistanceModule } from '../club-distance/club-distance.module';
import { SvgContainerModule } from '../svg-container/svg-container.module';
import { EventAttendersModule } from 'src/app/club/components/event-attenders/event-attenders.module';
import { AvatarNameModule } from '../avatar-name/avatar-name.module';
import { MatchJoinModule } from 'src/app/matches/match-join/match-join.module';
import { AvatarNameTabletModule } from '../avatar-name-tablet/avatar-name-tablet.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        ActivityLevelsModule,
        EventAttenderAvatarModule,
        PipesModule,
        ClubDistanceModule,
        SvgContainerModule,
        EventAttendersModule,
        AvatarNameModule,
        AvatarNameTabletModule,
        MatchJoinModule
    ],
    declarations: [
        MatchCardTabletComponent
    ],
    exports: [
        MatchCardTabletComponent
    ]
})

export class MatchCardTabletModule {}
