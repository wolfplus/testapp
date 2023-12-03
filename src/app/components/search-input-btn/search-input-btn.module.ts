import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputBtnComponent } from './search-input-btn.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule
  ],
  declarations: [SearchInputBtnComponent],
  exports: [SearchInputBtnComponent]
})
export class SearchInputBtnModule {}
