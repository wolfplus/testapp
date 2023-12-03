import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToArrayPipe } from './to-array';
import { MomentPipe } from './moment';
import { CurrencyFormatPipe } from './currency-format';
import { PriceFormat } from './price-format';
import { TruncatePipe } from './truncate';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ToArrayPipe,
    MomentPipe,
    CurrencyFormatPipe,
    PriceFormat,
    TruncatePipe,
  ],
  exports: [
    ToArrayPipe,
    MomentPipe,
    CurrencyFormatPipe,
    PriceFormat,
    TruncatePipe
  ]
})
export class PipesModule {}
