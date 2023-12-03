import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ManageParticipantsGroupBookingComponent} from "./manage-participants-group-booking.component";
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        ManageParticipantsGroupBookingComponent
    ],
    exports: [
        ManageParticipantsGroupBookingComponent
    ]
})

export class ManageParticipantsGroupBookingModule {}
