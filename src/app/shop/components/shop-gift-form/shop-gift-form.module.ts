import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {ShopGiftFormComponent} from "./shop-gift-form.component";
import {DefaultHeaderModule} from "../../../components/default-header/default-header.module";
import {BookingGroupFormModule} from "../../../booking-group-form/booking-group-form.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    DefaultHeaderModule,
    BookingGroupFormModule,
    TranslateModule
  ],
  declarations: [
    ShopGiftFormComponent
  ]
})
export class ShopGiftFormModule { }
