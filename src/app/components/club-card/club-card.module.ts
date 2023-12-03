import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubCardComponent } from './club-card.component';
import { ClubDistanceModule } from '../club-distance/club-distance.module';
import { AvatarNameModule } from '../avatar-name/avatar-name.module';

@NgModule({
  imports: [
    CommonModule,
    ClubDistanceModule,
    AvatarNameModule,
    IonicModule
  ],
  declarations: [ClubCardComponent],
  exports: [ClubCardComponent]
})
export class ClubCardModule { }
