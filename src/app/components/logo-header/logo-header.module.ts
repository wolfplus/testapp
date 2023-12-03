import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoHeaderComponent } from './logo-header.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [LogoHeaderComponent],
  exports: [
    LogoHeaderComponent
  ]
})
export class LogoHeaderModule { }
