import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchListComponent } from './match-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatchCardModule } from 'src/app/components/match-card/match-card.module';
import { IonicModule } from '@ionic/angular';
import { MatchCardTabletModule } from 'src/app/components/match-card-tablet/match-card-tablet.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    MatchCardModule,
    MatchCardTabletModule
  ],
  declarations: [MatchListComponent],
  exports: [MatchListComponent]
})
export class MatchListModule { }
