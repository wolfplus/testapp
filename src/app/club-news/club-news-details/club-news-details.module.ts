import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubNewsDetailsComponent } from './club-news-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    SharedComponentsModule,
    PipesModule
  ],
  declarations: [ClubNewsDetailsComponent],
  exports: [ClubNewsDetailsComponent]
})
export class ClubNewsDetailsModule {}
