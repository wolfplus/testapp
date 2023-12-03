import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollHideHeaderDirective } from './scroll-hide-header.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ScrollHideHeaderDirective],
  exports: [
    ScrollHideHeaderDirective
  ]
})
export class ScrollHideHeaderModule { }
