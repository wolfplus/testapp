import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderClubComponent } from './header-club.component';
import { ActivityLevelsModule } from 'src/app/components/activity-levels/activity-levels.module';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    ActivityLevelsModule,
    IonicModule,
    SharedComponentsModule
  ],
  declarations: [HeaderClubComponent],
  exports: [HeaderClubComponent]
})
export class HeaderClubModule { }
