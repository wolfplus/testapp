import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { IonicModule } from '@ionic/angular';
import { CommonsModalModule } from '../modal/commons/commons-modal-module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { CardModule } from '../components/payments/card/card.module';
import { SharedComponentsModule } from '../components/_shared-components/shared-components.module';
import {ShopRoutingModule} from "./shop-routing.module";
import {ShopCategoriesComponent} from "./components/shop-categories/shop-categories.component";
import {ShopListComponent} from "./components/shop-list/shop-list.component";
import {ShopItemDetailsComponent} from "./components/shop-item-details/shop-item-details.component";
import {ShopConfirmComponent} from "./components/shop-confirm/shop-confirm.component";
import {ShopFooterComponent} from "./components/shop-footer/shop-footer.component";
import {ShopConfirmFooterComponent} from "./components/shop-confirm-footer/shop-confirm-footer.component";
import {BookingGroupFormModule} from "../booking-group-form/booking-group-form.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CommonsModalModule,
    TranslateModule,
    PipesModule,
    CardModule,
    ShopRoutingModule,
    SharedComponentsModule,
    BookingGroupFormModule
  ],
  declarations: [
    ShopComponent,
    ShopCategoriesComponent,
    ShopListComponent,
    ShopItemDetailsComponent,
    ShopConfirmComponent,
    ShopFooterComponent,
    ShopConfirmFooterComponent
  ]
})
export class ShopModule { }
