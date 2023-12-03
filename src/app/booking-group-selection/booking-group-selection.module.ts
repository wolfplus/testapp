import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../shared/pipes/pipes.module';
import {DefaultHeaderModule} from "../components/default-header/default-header.module";
import {BookingGroupSelectionRoutingModule} from "./booking-group-selection-routing.module";
import {BookingGroupSelectionComponent} from "./booking-group-selection.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingGroupSelectionRoutingModule,
    TranslateModule,
    PipesModule,
    DefaultHeaderModule
  ],
  declarations: [
      BookingGroupSelectionComponent
  ]
})
export class BookingGroupSelectionModule { }
