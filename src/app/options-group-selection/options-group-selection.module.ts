import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../shared/pipes/pipes.module';
import {DefaultHeaderModule} from "../components/default-header/default-header.module";
import {OptionsGroupSelectionRoutingModule} from "./options-group-selection-routing.module";
import {OptionsGroupSelectionComponent} from "./options-group-selection.component";
import {SelectPlaygroundOptionsModule} from "../components/select-playground-options/select-playground-options.module";
import {ManageParticipantsGroupBookingModule} from "../components/manage-participants-group-booking/manage-participants-group-booking.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OptionsGroupSelectionRoutingModule,
        TranslateModule,
        PipesModule,
        DefaultHeaderModule,
        SelectPlaygroundOptionsModule,
        ManageParticipantsGroupBookingModule
    ],
  declarations: [
      OptionsGroupSelectionComponent
  ]
})
export class OptionsGroupSelectionModule { }
