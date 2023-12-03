import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '../../shared/pipes/pipes.module';
import { BookingAddUserChoiceModalComponent } from './booking-add-user-choice-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        PipesModule
    ],
    declarations: [
        BookingAddUserChoiceModalComponent
    ],
    exports: [
        BookingAddUserChoiceModalComponent
    ]
})

export class BookingAddUserChoiceModalModule {}
