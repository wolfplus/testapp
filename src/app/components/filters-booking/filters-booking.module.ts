import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {FiltersBookingComponent} from './filters-booking.component';
import {CalendarModule} from 'ion2-calendar';
import {TranslateModule} from '@ngx-translate/core';
import { FilterButtonModule } from '../filter-button/filter-button.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        CalendarModule,
        TranslateModule,
        FilterButtonModule
    ],
    declarations: [
        FiltersBookingComponent
    ],
    exports: [
        FiltersBookingComponent
    ]
})

export class FiltersBookingModule {}
