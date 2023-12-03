import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoomOnScrollDirective } from './zoom-on-scroll.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ZoomOnScrollDirective],
  exports: [ZoomOnScrollDirective]
})
export class ZoomOnScrollModule { }
