import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubPicCardComponent } from './club-pic-card.component';
import { ActivityLevelsModule } from '../activity-levels/activity-levels.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SvgContainerModule } from '../svg-container/svg-container.module';
import { ClubDistanceModule } from '../club-distance/club-distance.module';

@NgModule({
  imports: [
    CommonModule,
    ActivityLevelsModule,
    IonicModule,
    TranslateModule,
    SvgContainerModule,
    ClubDistanceModule
  ],
  declarations: [ClubPicCardComponent],
  exports: [ClubPicCardComponent]
})
export class ClubPicCardModule {}
