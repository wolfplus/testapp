import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../shared/pipes/pipes.module';
import {DefaultHeaderModule} from "../components/default-header/default-header.module";
import {BookingGroupFormComponent} from "./booking-group-form.component";
import {BookingGroupFormRoutingModule} from "./booking-group-form-routing.module";
import {CustomInputComponent} from "../components/custom-input/custom-input.component";
import {PhoneCodeModule} from "../components/phone-code/phone-code.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingGroupFormRoutingModule,
    TranslateModule,
    PipesModule,
    DefaultHeaderModule,
    PhoneCodeModule
  ],
  exports: [
    CustomInputComponent
  ],
  declarations: [
    BookingGroupFormComponent,
    CustomInputComponent
  ]
})
export class BookingGroupFormModule { }
