import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, combineLatest, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { slideInSlideOut } from 'src/app/animations';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/storage/user.service';
import { AppState } from 'src/app/state/app.state';

import { getDurationInMinutes } from 'src/utils/getDurationInMinutes';
import { ClubMatch } from '../match.model';
import { MatchService } from '../match.service';
import * as moment from 'moment';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { PlayerComponent } from 'src/app/player/player.component';
import { ClubDetailComponent } from 'src/app/club-detail/club-detail.component';
import { Geolocation } from 'src/app/shared/models/geolocation';
import { ModalService } from 'src/app/shared/services/modal.service';
import { MatchCommentsComponent } from '../match-comments/match-comments.component';
import { DateUtil } from 'src/app/shared/Tools/date-utils';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ColorStyle, FontSize } from 'src/app/shared/models/style';
import {PlaygroundService} from "../../shared/services/playground/playground.service";


@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss'],
  animations: [
    slideInSlideOut
  ]
})
export class MatchDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  [x: string]: any;

  /* TODO: for fast integration //  get the match from request */
  @Input() matchId: string;
  @Input() matchActivityId: string;
  @Input() isEditable = true;
  baseUrl = this.environmentService.getEnvFile().domainAPI;

  ColorStyle = ColorStyle;
  FontSize = FontSize;
  
  // user$: Observable<User>;
  user: User;
  userSubscription$: Subscription;
  userIsOrganizer = false;
  userIsParticipant = false;
  match: ClubMatch;
  matchSubscription$: Subscription;
  matchIsLoaded = false;
  conditionCancelHours: number;
  matchDuration: number;
  isAPastMatch: any = false;

  displayAttenders = false;
  displayInformation = true;
  displaylevelRequiredText = false;
  showNbOfTicketsSelector = false;
  showCancelMatch = false;
  maxTickets: number;
  bookedTickets: number;
  availableTickets: number;
  userNbOfTickets: number;
  seeMore = false;
  showSkeleton = true;
  responseHasError = false;
  showShareModal = false;
  matchDate: string;
  levelsSubscription$: Subscription;
  activityLevels: Array<any>;
  canCancel = true;
  cancellationCondition: string = undefined;
  levelRequired: boolean;
  playground: any;
  userLocation$: Observable<Geolocation>;
  userLocation: { latitude: number; longitude: number; };
  startAt: moment.Moment;
  endAt: moment.Moment;
  isAllin = false;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private store: Store<AppState>,
    private userService: UserService,
    private matchService: MatchService,
    private translate: TranslateService,
    private levelService: LevelService,
    private modalService: ModalService,
    private playgroundService: PlaygroundService,
    private dateUtil: DateUtil,
    public environmentService: EnvironmentService
  ) {
    this.platform.backButton.subscribeWithPriority(101, async () => {
      this.dismiss(false);
    });
    this.isAllin = this.environmentService.getEnvFile().marqueBlanche.clubIds[0] === '18c52639-e8e9-4f98-b2fa-9189d81fe5d1';
  }

  ngOnInit() {
    this.showSkeleton = true;
    this.userLocation$ = this.store.select('geolocation');
  }
  durationMatchText() {
    const val = this.matchDuration / 60 / 24;
    return parseInt( '' + val, 0);
  }
  ngAfterViewInit() {

    combineLatest([
      this.store.pipe(select("user"))
        .pipe(
          tap( user => {
            if ( user !== null) {
              this.user = user;
            } else {
              try {
                this.userService.get()
                  .subscribe( userStorage => this.user = userStorage);
              }
              catch {
                this.user = null;
              }
            }
          }),
          filter( user => user !== null),
          switchMap( () => {
            return this.levelService.get();
          }),
          filter(userActivitiesLevels => userActivitiesLevels !== undefined),
          map( userActivitiesLevels => userActivitiesLevels["hydra:member"]),
          tap( userActivitiesLevels => {
            this.userActivitiesLevels = userActivitiesLevels;
          }),
        ),
      this.matchService.getMatch(this.matchId)
        .pipe(
          tap( async data => {
            if (data) {
              this.match = data;
              this.playground = await this.playgroundService.getPlayground(
                  this.match.playground['@id'].replace('/clubs/playgrounds/', '')
              ).toPromise();
              const matchDate = moment(this.match.startAt);
              const now = moment();

              const differenceInSeconds = matchDate.diff(now, "seconds");
              if(differenceInSeconds < 43200 && this.playground.bookingCancellationConditionType === 'soft') {
                this.canCancel = false;
                this.conditionCancelHours = 12;
              } else if(differenceInSeconds < 86400 && this.playground.bookingCancellationConditionType === 'strict') {
                this.canCancel = false;
                this.conditionCancelHours = 24;
              } else if(differenceInSeconds < this.playground.bookingCancellationConditionCustomHours && this.playground.bookingCancellationConditionType === 'custom') {
                this.canCancel = false;
                this.conditionCancelHours = Math.floor(this.playground.bookingCancellationConditionCustomHours / 3600);
              }
              this.setCancellationCondition();
              if (this.matchDuration === undefined) {
                this.matchDuration = getDurationInMinutes(this.match.startAt, this.match.endAt);
              }
              this.matchDate = moment(this.match.startAt).format('LL');
              this.isAPastMatch = this.checkIfMatchIspast();
              this.match.participants.forEach( participant => {
                if (participant.activityLevel !== undefined && (participant.activityLevel !== null)) {
                  participant.user.levelToDisplay = this.composeLevelText(participant.activityLevel.identifier);
                }
              });
              // In the match details Organizer comes last so let's reverse it
              // this.match.participants.reverse();
              this.maxTickets = this.match.maxParticipantsCountLimit;
              // Number of booked tickets
              this.bookedTickets = this.match.participantsCount;
              // Number of available ticket
              this.availableTickets = this.maxTickets - this.bookedTickets;
              // Number of tickets booked by user
              this.userNbOfTickets = this.checkUserNumberOfTickets();
              this.userIsOrganizer = this.checkIfUserIsOrganizer();
              this.userIsParticipant = this.checkIfUserIsParticipant();
              this.levelRequired = this.match.activityLevelRequired;
              this.initMatchTime();
            } else {
              this.responseHasError = true;
              /* TODO: add real message and translations */
              // this.toastService.presentError(this.translate.instant('sorry_an_error_occurred'));
              this.modalCtrl.dismiss();
            }
          }),
          switchMap( () => {
            return this.levelService.getActivityLevels(this.match.activity.id);
          }),
          catchError( error => of(console.error("getMatch ERROR: ", error)))
        )
    ])
    .pipe(
      tap( () => {
        this.showSkeleton = false;
      }),
      map( streamObject => {
        return {
          userActivitiesLevels: streamObject[0],
          matchActivityLevels: streamObject[1]
        };
      }),
      tap( streamObject => {
        this.userActivitiesLevels = streamObject.userActivitiesLevels;
        this.matchActivityLevels = streamObject.matchActivityLevels;
        if (this.match.activityLevelRequired === true) {
          this.userActivityLevel = this.checkUserLevelForThisActivity(this.userActivitiesLevels);
          if (this.userActivityLevel !== null && this.userActivityLevel !== undefined) {
            const userHasLevel = this.checkIfUserHasLevel(this.userActivityLevel);
            if (!userHasLevel) {
              this.disableJoinButton = true;
              this.displaylevelRequiredText = true;
            }
          } else {
            this.disableJoinButton = true;
            this.displaylevelRequiredText = true;
          }
        }
      })
    )
    .subscribe();

  }

  ngOnDestroy() {
    if (this.levelsSubscription$ !== undefined) {
      this.levelsSubscription$.unsubscribe();
    }
  }

  setCancellationCondition() {
    switch (this.playground.bookingCancellationConditionType) {
      case "custom":
        this.cancellationCondition = this.translate.instant('booking_cancellation_condition_custom',
            { hours: this.hhmmss(this.playground.bookingCancellationConditionCustomHours) });
        break;
      case "strict":
        this.cancellationCondition = this.translate.instant('booking_cancellation_condition_strict');
        break;
      case "soft":
        this.cancellationCondition = this.translate.instant('booking_cancellation_condition_soft');
        break;
      default:
        this.cancellationCondition = undefined;
    }
  }

  hhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${this.pad(hours) !== '00' ? this.pad(hours) + 'h' : ''} ${this.pad(minutes) !== '00' ? this.pad(minutes) + 'min' : ''} ${this.pad(secs) !== '00' ? this.pad(secs) + 'sec' : ''}`;
  }

  pad(num) {
    return ("0" + num).slice(-2);
  }

  checkIfMatchIspast() {
    if (this.environmentService.overwriteMatchEvent()) {
      return moment(this.match.endAt).isBefore((moment()));
    }

    return moment(this.match.startAt).isBefore((moment().minute(0).hour(0).second(0).millisecond(0).subtract(1, 'days')));
  }

  editMatch() {
    // TODO: open edit modal
  }

  composeLevelText(levelNumber): string {
    if ((this.levelRequired === true && this.checkIfUserHasLevel(levelNumber) === false)) {
      return this.translate.instant('do_not_have_required_level');
    } else if (levelNumber === undefined) {
      return this.translate.instant('level_not_filled');
    } else {
      if (this.activityLevels !== undefined) {
        const matchingLevel = this.activityLevels.find( level => level.identifier === levelNumber);
        if (matchingLevel) {
          return `${this.translate.instant('level')} ${matchingLevel.identifier}. ${matchingLevel.label}`;
        } else {
          return this.translate.instant('user_do_not_have_match_level');
        }
      }
    }
    return null;
  }

  checkUserLevelForThisActivity(userActivitiesLevels): number | null {
    const userMatchingActivity =  userActivitiesLevels.find( activity => {
      return this.match.activity['@id'] === activity.activity['@id'];
    });
    if (userMatchingActivity !== undefined) {
      return userMatchingActivity.activityLevels[0].identifier;
    } else {
      return null;
    }
  }

  checkIfUserHasLevel(levelNumber: number): boolean {
    if (levelNumber === undefined) {
      return false;
    }
    if (this.match.activityLevels && this.match.activityLevels.length) {
      if (this.match.activityLevels.length > 1) {
        return levelNumber >= this.match.activityLevels[0].identifier && levelNumber <= this.match.activityLevels[1].identifier;
      } else if (this.match.activityLevels.length === 1) {
        return levelNumber === this.match.activityLevels[0].identifier;
      }
    } else {
      return true;
    }
    return false;
  }

  expandDescription() {
    this.seeMore = true;
    // TODO: add scrollTop
  }

  checkUserNumberOfTickets(): number {
    let matchingParticipants;
    let count = 0;
    if (this.user !== null) {
      matchingParticipants = this.match.participants
      .filter( participant =>  participant.canceled === false)
      .filter( participant => {
        if (participant.addedBy && !participant.user && !participant.client) {
          return participant.addedBy.id === this.user.id;
        }
        return false;
      });
      if (matchingParticipants.length) {
        count = matchingParticipants.length + 1;
      } else if (this.match.participants.find( participant => participant.user !== null && (participant.user.id === this.user.id))) {
        count = 1;
      }
    }
    return count;
  }

  checkIfUserIsOrganizer(): boolean {
    if (this.user && this.match.userClient) {
      if (this.match.userClient.id === this.user.id) {
        return true;
      }
    }
    return false;
  }

  checkIfUserIsParticipant(): boolean {
    if (this.user !== null) {
      const matchingUser = this.match.participants
        .filter(participant => participant.user !== undefined && participant.user !== null)
        .find(participant => participant.user.id === this.user.id);
      if (matchingUser) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  segmentChanged(event) {
    switch (event.detail.value) {
      case 'information':
        this.displayAttenders = false;
        this.displayInformation = true;
        break;
      case 'attenders':
        this.displayAttenders = true;
        this.displayInformation = false;
        break;
      default:
        this.displayInformation = true;
        break;
    }
  }

  goToPlayerProfile(participant) {
    if (participant.user !== undefined && participant.user !== null) {
      if (participant.user.id !== this.user.id) {
        this.presentPlayerModal(participant.user.id);
      } else {
        return;
      }
    } else {
      return;
    }
  }

  presentPlayerModal(id) {
    return this.modalCtrl.create({
      component: PlayerComponent,
      cssClass: 'player-class',
      componentProps: {id}
    }).then(modal => {
      modal.present().then();
      modal.onDidDismiss();
    });
  }

  presentClubModal(id, selectedView = 'informations') {
    return this.modalCtrl.create({
      // component: ClubPage,
      component: ClubDetailComponent,
      cssClass: 'club-details-class',
      componentProps: {
        id,
        selectedView
      },
      swipeToClose: true
    }).then(modal => {
      modal.onDidDismiss();
      modal.present();
    });
  }

  participate() {
    this.showNbOfTicketsSelector = true;
  }

  goToClub() {
    this.presentClubModal(this.match.club.id);
    // this.modalService.showClub(this.match.club.id);
  }

  closeJoinMatchModal(event) {
    this.showNbOfTicketsSelector = false;
    if (event === true) {
      this.dismiss(true);
    }
  }

  closeCancelMatch(event) {
    this.showCancelMatch = false;
    if (event === true) {
      this.dismiss(true);
    }
  }

  openShareMatchModal() {
    this.showShareModal = true;
  }

  closeShareMatchModal() {
    this.showShareModal = false;
  }

  dismiss(reload) {
    this.modalCtrl.dismiss({reload});
  }

  goToComments() {
    this.modalService.presentMatchComments(
      MatchCommentsComponent,
      this.matchId,
      this.match.name,
      this.user.id,
      this.match.club.name,
      this.match.club.logo.contentUrl
    );
  }

  initMatchTime() {
    this.startAt = this.dateUtil.getLocaleDateFromClubTimeZone(this.match.startAt, moment.tz.guess(), this.match.club.timezone);
    this.endAt = this.dateUtil.getLocaleDateFromClubTimeZone(this.match.endAt, moment.tz.guess(), this.match.club.timezone);
  }

}
