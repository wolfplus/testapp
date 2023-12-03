import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgContainerComponent } from './svg-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SvgContainerComponent],
  exports: [
    SvgContainerComponent
  ]
})
export class SvgContainerModule { }
