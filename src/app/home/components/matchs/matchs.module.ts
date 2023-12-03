import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardMyBookingModule } from 'src/app/components/card-my-booking/card-my-booking.module';
import { TranslateModule } from '@ngx-translate/core';
import {MatchsComponent} from './matchs.component';
import {IonicModule} from '@ionic/angular';
import {MatchCardModule} from '../../../components/match-card/match-card.module';
import { MatchCardTabletModule } from 'src/app/components/match-card-tablet/match-card-tablet.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CardMyBookingModule,
        IonicModule,
        PipesModule,
        MatchCardModule,
        MatchCardTabletModule
    ],
    declarations: [MatchsComponent],
    exports: [MatchsComponent]
})
export class MatchsModule { }
