import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonRoundComponent } from './button-round.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [ButtonRoundComponent],
  exports: [ButtonRoundComponent]
})
export class ButtonRoundModule { }
