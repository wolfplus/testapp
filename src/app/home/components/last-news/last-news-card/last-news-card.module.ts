import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastNewsCardComponent } from './last-news-card.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  declarations: [LastNewsCardComponent],
  exports: [LastNewsCardComponent]
})
export class LastNewsCardModule { }
