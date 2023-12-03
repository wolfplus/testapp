import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core';
import { ActivitiesComponent } from './components/activities/activities.component';
import { DiscoversComponent } from './components/discovers/discovers.component';
import { EventsComponent } from './components/events/events.component';
import { MyClubsComponent } from './components/my-clubs/my-clubs.component';
import { SportCardModule } from '../components/sport-card/sport-card.module';
import { EmptyBlockModule } from '../components/empty-block/empty-block.module';
import { CardShortEventModule } from '../components/card-short-event/card-short-event.module';
import { FilterButtonModule } from '../components/filter-button/filter-button.module';
import { CardMyBookingModule } from '../components/card-my-booking/card-my-booking.module';
import { CardShortClubModule } from '../components/card-short-club/card-short-club.module';
import { SearchInputModule } from '../components/search-input/search-input.module';
import { SpinnerModule } from '../components/spinner/spinner.module';
import { LocaleChoiceModule } from '../components/locale-choice/locale-choice.module';
import { UserActionsModule } from '../components/user-actions/user-actions.module';
import { HomeAccountComponent } from './components/home-account/home-account.component';
import { SearchInputBtnModule } from '../components/search-input-btn/search-input-btn.module';
import { ModalHeaderModule } from '../components/modal-header/modal-header.module';
import { CardClubModule } from '../components/card-club/card-club.module';
import { LogoHeaderModule } from '../components/logo-header/logo-header.module';
import { ClubPicCardModule } from '../components/club-pic-card/club-pic-card.module';
import { ZoomOnScrollModule } from '../shared/directives/zoom-on-scroll/zoom-on-scroll.directive.module';
import { HeaderMbModule } from '../components/mb/home/header/header-mb.module';
import { ActionsModule } from '../components/mb/home/actions/actions.module';
import { MatchCardModule } from '../components/match-card/match-card.module';
import { MatchsModule } from './components/matchs/matchs.module';
import { SocialNetworksLinksModule } from '../components/social-networks-links/social-networks-links.module';
import { LastNewsModule } from './components/last-news/last-news.module';
import { LastBookingModule } from './components/last-booking/last-booking.module';
import { HeaderModule } from './components/header/header.module';
import { LastCourseModule } from './components/last-course/last-course.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { MyQrCodeModule } from './components/my-qr-code/my-qr-code.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        TranslateModule,
        ReactiveFormsModule,
        SportCardModule,
        EmptyBlockModule,
        CardShortEventModule,
        FilterButtonModule,
        CardMyBookingModule,
        CardShortClubModule,
        SearchInputModule,
        SpinnerModule,
        PipesModule,
        LocaleChoiceModule,
        UserActionsModule,
        SearchInputBtnModule,
        ModalHeaderModule,
        CardClubModule,
        LogoHeaderModule,
        ClubPicCardModule,
        ZoomOnScrollModule,
        HeaderMbModule,
        ActionsModule,
        MatchCardModule,
        MatchsModule,
        SocialNetworksLinksModule,
        LastNewsModule,
        LastBookingModule,
        LastCourseModule,
        HeaderModule,
        MyQrCodeModule
    ],
    declarations: [
        HomePage,
        ActivitiesComponent,
        EventsComponent,
        MyClubsComponent,
        HomeAccountComponent,
        DiscoversComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
