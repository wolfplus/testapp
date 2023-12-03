import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObserveVisibilityDirective } from './observe-visibility.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ObserveVisibilityDirective
  ],
  exports: [ObserveVisibilityDirective]
})
export class ObserveVisibilityDirectiveModule {}
