import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {BookingTotalPriceComponent} from './booking-total-price.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        BookingTotalPriceComponent
    ],
    exports: [
        BookingTotalPriceComponent
    ]
})

export class BookingTotalPriceModule {}
