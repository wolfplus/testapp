import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ClubDetailComponent } from './club-detail.component';
import { InformationAccountModule } from '../account/components/informations-account/information-account.module';
import { NavBarClubComponent } from './components/nav-bar-club/nav-bar-club.component';
import { InformationClubComponent } from './components/information-club/information-club.component';
import { SvgContainerModule } from '../components/svg-container/svg-container.module';
import { MatchCardModule } from '../components/match-card/match-card.module';
import { FiltersBookingModule } from '../components/filters-booking/filters-booking.module';
import { MatchClubModule } from './components/match-club/match-club.module';
import { HeaderClubModule } from './components/header-club/header-club.module';
import { AvatarNameModule } from '../components/avatar-name/avatar-name.module';
import { ClubDistanceModule } from '../components/club-distance/club-distance.module';
import { MapModule } from './components/map/map.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        InformationAccountModule,
        SvgContainerModule,
        MatchCardModule,
        FiltersBookingModule,
        MatchClubModule,
        HeaderClubModule,
        AvatarNameModule,
        ClubDistanceModule,
        MapModule
    ],
    declarations: [
        ClubDetailComponent,
        NavBarClubComponent,
        InformationClubComponent
    ],
    exports: [
        ClubDetailComponent
    ]
})

export class ClubDetailModule {}
