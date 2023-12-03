import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelCardComponent } from './level-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { SvgContainerModule } from 'src/app/components/svg-container/svg-container.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    SvgContainerModule
  ],
  declarations: [LevelCardComponent],
  exports: [LevelCardComponent]
})
export class LevelCardModule { }
