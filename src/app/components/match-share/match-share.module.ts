import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchShareComponent } from './match-share.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule
  ],
  declarations: [MatchShareComponent],
  exports: [MatchShareComponent]
})
export class MatchShareModule { }
