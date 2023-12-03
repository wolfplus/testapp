import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ConversationComponent} from './conversation.component';
import {BookingJoinComponent} from '../booking-join/booking-join.component';
import {DefaultHeaderModule} from '../../../components/default-header/default-header.module';
import {BookingCardShortModule} from '../../../components/booking-card-short/booking-card-short.module';
import {CardMyBookingModule} from '../../../components/card-my-booking/card-my-booking.module';
import {FriendRequestComponent} from '../friend-request/friend-request.component';
import {MatchInvitationComponent} from '../match-invitation/match-invitation.component';
import {MatchCardModule} from '../../../components/match-card/match-card.module';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import { ObserveVisibilityDirectiveModule } from 'src/app/shared/directives/observe-visibility/observe-visibility.directive.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        DefaultHeaderModule,
        BookingCardShortModule,
        CardMyBookingModule,
        MatchCardModule,
        PipesModule,
        ObserveVisibilityDirectiveModule
    ],
    declarations: [
        ConversationComponent,
        BookingJoinComponent,
        FriendRequestComponent,
        MatchInvitationComponent
    ],
    exports: [
        ConversationComponent
    ]
})

export class ConversationModule {}
