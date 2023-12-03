import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalHeaderComponent } from './modal-header/modal-header.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ModalHeaderComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ModalHeaderComponent
  ]
})
export class CommonsModalModule { }
