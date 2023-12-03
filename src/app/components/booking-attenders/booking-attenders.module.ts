import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {BookingAttendersComponent} from './booking-attenders.component';
import {SelectFriendsModule} from '../friends/select-friends/select-friends.module';
import {BookingSportConfirmModule} from '../../modal/booking/booking-sport-confirm/booking-sport-confirm.module';
import {PipesModule} from '../../shared/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        SelectFriendsModule,
        BookingSportConfirmModule,
        PipesModule
    ],
    declarations: [
        BookingAttendersComponent
    ],
    exports: [
        BookingAttendersComponent
    ]
})

export class BookingAttendersModule {}
