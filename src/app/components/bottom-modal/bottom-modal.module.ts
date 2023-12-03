import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomModalComponent } from './bottom-modal.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [BottomModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule
  ],
  exports: [BottomModalComponent]
})
export class BottomModalModule {}
