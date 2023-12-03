import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyImgDirective } from './lazy-img.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [	
    LazyImgDirective
 ],
  exports: [
    LazyImgDirective
  ]
})
export class LazyImageModule { }
