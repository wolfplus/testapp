import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { SearchInputModule } from 'src/app/components/search-input/search-input.module';
import { FilterButtonModule } from 'src/app/components/filter-button/filter-button.module';
import { SearchInputBtnModule } from 'src/app/components/search-input-btn/search-input-btn.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SearchInputModule,
    FilterButtonModule,
    SearchInputBtnModule,
    TranslateModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule { }
