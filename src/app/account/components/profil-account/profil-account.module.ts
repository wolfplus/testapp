import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProfilAccountComponent } from './profil-account.component';
import { CardMyBookingModule } from '../../../components/card-my-booking/card-my-booking.module';
import { MatchCardModule } from '../../../components/match-card/match-card.module';
import { ClubModule } from '../../../club/club.module';
import { LevelCardModule } from '../level-card/level-card.module';
import { LastBookingModule } from 'src/app/home/components/last-booking/last-booking.module';
import { MatchsModule } from 'src/app/home/components/matchs/matchs.module';
import { MatchCardTabletModule } from 'src/app/components/match-card-tablet/match-card-tablet.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CardMyBookingModule,
        MatchCardModule,
        ClubModule,
        LevelCardModule,
        LastBookingModule,
        MatchsModule,
        MatchCardTabletModule
    ],
    exports: [
        ProfilAccountComponent
    ],
    declarations: [ProfilAccountComponent]
})
export class ProfilAccountModule {}
