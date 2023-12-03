import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { LogoHeaderModule } from 'src/app/components/logo-header/logo-header.module';
import { SearchInputBtnModule } from 'src/app/components/search-input-btn/search-input-btn.module';

@NgModule({
  imports: [
    CommonModule,
    LogoHeaderModule,
    IonicModule,
    SearchInputBtnModule
  ],
  declarations: [HeaderComponent],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule {}
