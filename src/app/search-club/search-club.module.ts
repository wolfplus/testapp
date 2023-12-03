import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchClubPageRoutingModule } from './search-club-routing.module';
import { SearchClubPage } from './search-club.page';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { CalendarModule } from 'ion2-calendar';
import {SearchInputModule} from '../components/search-input/search-input.module';
import {FiltersBookingModule} from '../components/filters-booking/filters-booking.module';
import {CardClubModule} from '../components/card-club/card-club.module';
import {FilterButtonModule} from '../components/filter-button/filter-button.module';
import { SvgContainerModule } from '../components/svg-container/svg-container.module';
import { ModalHeaderModule } from '../components/modal-header/modal-header.module';
import {HeaderModule} from './components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SearchClubPageRoutingModule,
    CalendarModule,
    SearchInputModule,
    FiltersBookingModule,
    CardClubModule,
    FilterButtonModule,
    SvgContainerModule,
    ModalHeaderModule,
    HeaderModule
  ],
  declarations: [
    SearchClubPage
  ]
})
export class SearchClubPageModule {
  constructor(
      public translate: TranslateService
  ) {
  }
}
