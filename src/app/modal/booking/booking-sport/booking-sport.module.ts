import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingSportPageRoutingModule } from './booking-sport-routing.module';

import { BookingSportPage } from './booking-sport.page';
import {TranslateModule} from '@ngx-translate/core';
import {SelectCountPlayerModule} from '../../../components/select-count-player/select-count-player.module';
import {BookingAttendersModule} from '../../../components/booking-attenders/booking-attenders.module';
import {BookingTotalPriceModule} from '../../../components/booking-total-price/booking-total-price.module';
import {SelectFriendsModule} from '../../../components/friends/select-friends/select-friends.module';
import { CommonsModalModule } from '../../commons/commons-modal-module';
import { SelectPlaygroundOptionsModule } from 'src/app/components/select-playground-options/select-playground-options.module';
import { BookingAddUserChoiceModalModule } from 'src/app/components/booking-add-user-choice-modal/booking-add-user-choice-modal.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BookingSportPageRoutingModule,
        TranslateModule,
        SelectCountPlayerModule,
        SelectPlaygroundOptionsModule,
        BookingAttendersModule,
        BookingTotalPriceModule,
        SelectFriendsModule,
        CommonsModalModule,
        BookingAddUserChoiceModalModule
    ],
    declarations: [BookingSportPage]
})
export class BookingSportPageModule {}
