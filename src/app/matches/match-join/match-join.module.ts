import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchJoinComponent } from './match-join.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule
  ],
  declarations: [MatchJoinComponent],
  exports: [MatchJoinComponent]
})
export class MatchJoinModule {}
