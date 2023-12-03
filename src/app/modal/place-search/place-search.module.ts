import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceSearchPageRoutingModule } from './place-search-routing.module';

import { PlaceSearchPage } from './place-search.page';
import { ModalHeaderModule } from 'src/app/components/modal-header/modal-header.module';
import { SearchInputModule } from 'src/app/components/search-input/search-input.module';
import { TranslateModule } from '@ngx-translate/core';
import { SvgContainerModule } from 'src/app/components/svg-container/svg-container.module';
import { AvatarNameModule } from 'src/app/components/avatar-name/avatar-name.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceSearchPageRoutingModule,
    ModalHeaderModule,
    SearchInputModule,
    TranslateModule,
    SvgContainerModule,
    AvatarNameModule
  ],
  declarations: [PlaceSearchPage],
  exports: [PlaceSearchPage]
})
export class PlaceSearchPageModule {}
