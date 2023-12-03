import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchCommentsComponent } from './match-comments.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DefaultHeaderModule } from 'src/app/components/default-header/default-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PipesModule,
    DefaultHeaderModule
  ],
  declarations: [MatchCommentsComponent],
  exports: [MatchCommentsComponent]
})
export class MatchCommentsModule {}
