import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchCancelComponent } from './match-cancel.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatchCardModule } from 'src/app/components/match-card/match-card.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatchCardModule,
    IonicModule
  ],
  declarations: [MatchCancelComponent],
  exports: [MatchCancelComponent]
})
export class MatchCancelModule {}
