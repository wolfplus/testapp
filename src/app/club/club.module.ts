import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ClubPageRoutingModule } from './club-routing.module';

import { ClubPage } from './club.page';
import { ClubHeaderComponent } from './containers/club-header/club-header.component';
import { ClubPhotoHeaderComponent } from './containers/club-photo-header/club-photo-header.component';
import { ClubPhotoComponent } from './components/club-photo/club-photo.component';
import { ClubSummaryComponent } from './components/club-summary/club-summary.component';
import { ClubReviewShortComponent } from '../components/club-review-short/club-review-short.component';
import { NavLinksComponent } from './components/nav-links/nav-links.component';
import { ClubTimetableComponent } from './components/club-timetable/club-timetable.component';
import { AboutClubComponent } from './components/about-club/about-club.component';
import { ClubActivitiesComponent } from './components/club-activities/club-activities.component';
import { ClubAddressComponent } from './components/club-address/club-address.component';
import { ClubServicesComponent } from './components/club-services/club-services.component';
import { ClubReviewsComponent } from './components/club-reviews/club-reviews.component';
import { ClubMapComponent } from './components/club-map/club-map.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { ClubContentInfosComponent } from './containers/club-content-infos/club-content-infos.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { ClubContentMyClubComponent } from './containers/club-content-my-club/club-content-my-club.component';
import { MyClubUpcomingEventsComponent } from './containers/my-club-upcoming-events/my-club-upcoming-events.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { MyClubCoursesComponent } from './containers/my-club-courses/my-club-courses.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { ClubContentMatchsComponent } from './containers/club-content-matchs/club-content-matchs.component';
import { ClubAllEventsComponent } from './containers/club-all-events/club-all-events.component';
import { MatchesModule } from '../matches/matches.module';
import { ButtonRoundModule } from '../components/button-round/button-round.module';
import { EventDetailComponent } from './containers/event-detail/event-detail.component';
import { EventDetailBodyComponent } from './components/event-detail-body/event-detail-body.component';
import { EventDateAndTypeComponent } from './components/event-date-and-type/event-date-and-type.component';
import { EventInfosComponent } from './components/event-infos/event-infos.component';

import { InlineSVGModule } from 'ng-inline-svg';
import {ActivityLevelsModule} from '../components/activity-levels/activity-levels.module';
import {LocationModule} from '../components/location/location.module';
import {AboutModule} from '../components/about/about.module';
import {ModalHeaderModule} from '../components/modal-header/modal-header.module';
import {EventAttenderAvatarModule} from './components/event-attender-avatar/event-attender-avatar.module';
import {ShareButtonModule} from '../components/share-button/share-button.module';
import {LikeButtonModule} from '../components/like-button/like-button.module';
import {MatchCardModule} from '../components/match-card/match-card.module';
import {EventTitleModule} from './components/event-title/event-title.module';
import {ClubLocationModule} from './components/club-location/club-location.module';
import { ClubDistanceModule } from '../components/club-distance/club-distance.module';
import { EventDetailHeaderModule } from './components/event-detail-header/event-detail-header.module';
import {EventAttendersModule} from './components/event-attenders/event-attenders.module';

@NgModule({
    declarations: [
        NavLinksComponent,
        ClubPage,
        ClubHeaderComponent,
        ClubPhotoHeaderComponent,
        BackButtonComponent,
        ClubPhotoComponent,
        ClubSummaryComponent,
        ClubReviewShortComponent,
        ClubContentInfosComponent,
        ClubTimetableComponent,
        AboutClubComponent,
        ClubActivitiesComponent,
        ClubAddressComponent,
        ClubServicesComponent,
        ClubReviewsComponent,
        ClubMapComponent,
        ClubContentMyClubComponent,
        MyClubUpcomingEventsComponent,
        EventCardComponent,
        MyClubCoursesComponent,
        CourseCardComponent,
        ClubContentMatchsComponent,
        ClubAllEventsComponent,
        EventDetailComponent,
        EventDetailBodyComponent,
        EventDateAndTypeComponent,
        EventInfosComponent,
    ],
    exports: [
        EventCardComponent,
        ClubMapComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        ClubPageRoutingModule,
        PipesModule,
        TranslateModule,
        MatchesModule,
        ButtonRoundModule,
        InlineSVGModule.forRoot(),
        ActivityLevelsModule,
        LocationModule,
        AboutModule,
        EventAttenderAvatarModule,
        ShareButtonModule,
        LikeButtonModule,
        MatchCardModule,
        EventTitleModule,
        ModalHeaderModule,
        ClubLocationModule,
        ClubDistanceModule,
        EventDetailHeaderModule,
        EventAttendersModule
    ]
})
export class ClubModule { }
