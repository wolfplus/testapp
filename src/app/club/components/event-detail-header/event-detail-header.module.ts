import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetailHeaderComponent } from './event-detail-header.component';
import { ShareButtonModule } from 'src/app/components/share-button/share-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    ShareButtonModule,
    TranslateModule,
    PipesModule,
    IonicModule
  ],
  declarations: [EventDetailHeaderComponent],
  exports: [EventDetailHeaderComponent]
})
export class EventDetailHeaderModule {}
