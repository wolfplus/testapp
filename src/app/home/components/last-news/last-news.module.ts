import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastNewsComponent } from './last-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { LastNewsCardModule } from './last-news-card/last-news-card.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    LastNewsCardModule
  ],
  declarations: [LastNewsComponent],
  exports: [LastNewsComponent]
})
export class LastNewsModule {}
