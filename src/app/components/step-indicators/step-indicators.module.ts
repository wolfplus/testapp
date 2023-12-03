import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepIndicatorsComponent } from './step-indicators.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  declarations: [StepIndicatorsComponent],
  exports: [StepIndicatorsComponent]
})
export class StepIndicatorsModule { }
