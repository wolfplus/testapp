import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateSelectComponent } from './date-select.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SvgContainerModule } from 'src/app/components/svg-container/svg-container.module';
import { CalendarModule } from 'ion2-calendar';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    SvgContainerModule,
    CalendarModule,
    FormsModule
  ],
  declarations: [DateSelectComponent],
  exports: [DateSelectComponent]
})
export class DateSelectModule { }
