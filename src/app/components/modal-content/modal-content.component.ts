import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonNav, IonInfiniteScroll, NavParams } from '@ionic/angular';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { slideInSlideOut } from 'src/app/animations';
import { ClubMatch } from 'src/app/matches/match.model';
import { BookingService } from 'src/app/shared/services/booking/booking.service';
import { Booking } from 'src/app/shared/models/booking';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { formatResponse } from 'src/utils/format-response';
import { getDurationInMinutes } from 'src/utils/getDurationInMinutes';
import { SelectFriendsComponent, SelectFriendsConfig } from '../friends/select-friends/select-friends.component';
import { TranslateService } from '@ngx-translate/core';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import { MatchService } from 'src/app/matches/match.service';
import { select, Store } from '@ngrx/store';
import { MatchState } from 'src/app/matches/store/match.reducer';
import { Router } from '@angular/router';
import { AppState } from 'src/app/state/app.state';
import * as SelectedDateActions from '../../state/actions/selectedDate.actions';
import * as moment from 'moment';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import {getCurrentClub} from "../../club/store";
import {ClubState} from "../../club/store/club.reducers";
import { Keyboard } from "@capacitor/keyboard";
import { ColorStyle, FontSize } from 'src/app/shared/models/style';
import { ActivityLevel } from 'src/app/shared/models/activity-level';


export interface TransitObject {
  userId?: string;
  matchName: string;
  matchInfos: string;
  matchLevels: any;
  activityLevels: any;
  selectedBooking: Booking;
  levelsToDisplay: Array<any>;
  matchParticipants: Array<any>;
  maxParticipantsCountLimit: number;
  participantsCount: number;
  restrictAccess: boolean;
  restrictLevel: boolean;
  pricePerParticipant: number;
  matchUserGuests: Array<any>;
}

export interface MatchData {
  name: string;
  access: string;
  activityLevelRequired: boolean;
  activityLevels: Array<string>;
  booking: string;
  userClient: string;
  participants: Array<any>;
  description: string;
  guest: Array<any>;
}

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  animations: [
    slideInSlideOut
  ]
})
export class ModalContentComponent implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  env;
  userId: string;
  match: ClubMatch;
  MatchCardConfig = MatchCardConfig;
  matchSubmitted = false;
  matchCreated = false;
  loadComplete = false;
  createMatchError = false;
  createMatchSuccessSubscription$: Subscription;
  createMatchErrorSubscription$: Subscription;
  subscriptions$: Array<Subscription> = [];

  currentClubSub: Subscription;
  currentClub;

  isCreationMode = true;

  step = 0;
  steps = 3;
  nextPage = ModalContentComponent;
  nextBookingPage: string;
  transitObject: TransitObject;

  // bookings$: Observable<Array<any>>;
  bookingsSubscription$: Subscription;
  /* TODO ADD a type for Booking */
  bookings: any;
  bookingsHaveFinishedLoading = false;
  selectedBooking: Booking;

  // matchLevels$: Observable<Array<any>>;
  levelsSubscription$: Subscription;
  rangeSteps: number;
  selectedLevelsToDisplay: Array<{ identifier: number, label: string, iri: string }>;

  matchName: string;
  displayMissingNameError = false;
  nameRequiredMessage = this.translate.instant('required_field');

  activityLevels: any;
  activityMinLevel: number;
  activityMaxLevel: number;
  levelsAreLoaded = false;

  userSelectedActivityLevel: number;
  userActivityLevels: Array<any>;

  matchLevels: { lower: number, upper: number };
  restrictLevel = false;
  displayLevelRestrictionError = false;
  restrictAccess = false;
  matchInfos = "";
  matchParticipants: any;

  matchUserGuests: Array<any>;

  pricePerParticipant: number;

  requestHasError = false;

  showInvitationSelector = false;
  userNbOfTickets: number;
  bookedTickets: number;
  availableTickets: number;
  maxTickets: number;

  // SEGMENTS
  displayAttenders = true;
  displayInvitations = false;
  nbOfParticipantsUnderUserName = 1;

  showFooter = true;
  hasNext: boolean;
  maxParticipantsCountLimit: any;
  participantsCount: any;
  createdMatch: ClubMatch;
  selectedMatchId: any;
  selectedMatchActivityId: any;

  ColorStyle = ColorStyle;
  FontSize = FontSize;

  constructor(
    private modalController: ModalController,
    private nav: IonNav,
    private bookingService: BookingService,
    private levelService: LevelService,
    private modalCtrl: ModalController,
    public translate: TranslateService,
    private matchService: MatchService,
    private matchStore: Store<MatchState>,
    private store: Store<AppState>,
    private router: Router,
    private navParams: NavParams,
    private environmentService: EnvironmentService,
    private clubStore: Store<ClubState>,
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit() {

    this.currentClubSub = this.clubStore.pipe(
        select(getCurrentClub),
        tap(club => {
          this.currentClub = club;
        })
    ).subscribe();

    if (this.navParams && this.navParams.data.userId !== undefined) {
      this.userId = this.navParams.data.userId;
    }

    if (this.userId === undefined) {
      this.store
        .pipe(
          select('user'),
          take(1),
          tap(user => this.userId = user.id),
          switchMap(() => this.levelService.get()),
          tap(userRelatedActivity => {
            if (userRelatedActivity === undefined) {
              this.userActivityLevels = null;
            }
          }),
          filter(userRelatedActivity => userRelatedActivity !== undefined),
          map(userRelatedActivity => userRelatedActivity['hydra:member']),
          tap(userRelatedActivityLevels => this.userActivityLevels = userRelatedActivityLevels)
        )
        .subscribe();
    } else {
      this.levelService.get()
        .pipe(
          tap(userLevels => this.userActivityLevels = userLevels),
          // tap( userLevels => this.userSelectedActivityLevel = this.checkUserActivityLevel(userLevels))
        )
        .subscribe();
    }

    /* window.addEventListener('keyboardWillShow', (event) => {
      this.showFooter = false;
    });
    window.addEventListener('keyboardWillHide', () => {
      this.showFooter = true;
    }); */

    if (window.origin.includes('capacitor://')) {
      Keyboard.addListener('keyboardWillShow', () => {
      });
    }

    // TODO: delete if not working + Actions + Effects + Reducers
    this.createMatchSuccessSubscription$ = this.matchStore.select('matchCreatedSuccess').pipe(
      tap(() => {
        this.loadComplete = true;
        this.createMatchError = false;
      })
    )
      .subscribe();
    this.subscriptions$.push(this.createMatchSuccessSubscription$);

    this.createMatchErrorSubscription$ = this.matchStore.select('matchCreateError').pipe(
      tap(() => {
        this.loadComplete = true;
        this.createMatchError = true;
      })
    )
      .subscribe();
    this.subscriptions$.push(this.createMatchErrorSubscription$);

    if (this.transitObject !== undefined) {
      if (this.transitObject['userId']) {
        this.userId = this.transitObject['userId'];
      }
      if (this.transitObject['selectedBooking']) {
        this.selectedBooking = this.transitObject['selectedBooking'];
      }
      if (this.transitObject['matchLevels']) {
        this.matchLevels = this.transitObject['matchLevels'];
      }
      if (this.transitObject['activityLevels']) {
        this.activityLevels = this.transitObject['activityLevels'];
      }
      if (this.transitObject['levelsToDisplay']) {
        this.selectedLevelsToDisplay = this.transitObject['levelsToDisplay'];
      }
      if (this.transitObject['matchName']) {
        this.matchName = this.transitObject['matchName'];
      }
      if (this.transitObject['matchInfos']) {
        this.matchInfos = this.transitObject['matchInfos'];
      }
      if (this.transitObject['matchParticipants']) {
        this.matchParticipants = this.transitObject['matchParticipants'];
      }
      if (this.transitObject['maxParticipantsCountLimit']) {
        this.maxParticipantsCountLimit = this.transitObject['maxParticipantsCountLimit'];
      }
      if (this.transitObject['participantsCount']) {
        this.participantsCount = this.transitObject['participantsCount'];
      }
      if (this.transitObject['restrictLevel']) {
        this.restrictLevel = this.transitObject['restrictLevel'];
      }
      if (this.transitObject['restrictAccess']) {
        this.restrictAccess = this.transitObject['restrictAccess'];
      }
      if (this.transitObject['pricePerParticipant']) {
        this.pricePerParticipant = this.transitObject['pricePerParticipant'];
      }
      if (this.transitObject['matchUserGuests']) {
        this.matchUserGuests = this.transitObject['matchUserGuests'];
      }
    }
    this.triggerMatchCreationStepAction(this.step);
  }

  ngOnDestroy() {
    if (this.subscriptions$ !== undefined && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(sub => {
        if (sub !== undefined) {
          sub.unsubscribe();
        }
      });
    }
  }

  triggerMatchCreationStepAction(step) {
    switch (step) {
      case 0:
        this.navParams.data.bookingIRI === undefined ?
          this.getBookings() : this.getBooking(this.navParams.data.bookingIRI);
        break;
      case 1:
        this.getActivityLevels(this.transitObject.selectedBooking.activity['id']);
        break;
      case 2:
        this.composeMatch();
        this.computeParticipantsData();
        break;
    }
  }

  goToClubSearch() {
    this.close(false);
    this.router.navigate(['/search-club']);
  }

  goToBookingList() {
    this.close(false);
    this.router.navigate(['select-booking'],
      {
        queryParams: {
          name: this.environmentService.getEnvFile().marqueBlanche.nameMb,
          guid: this.currentClub.id
        }
      }
    )
      .then();
  }

  getBooking(bookingIRI) {
    this.bookingService.getMyBooking(bookingIRI)
      .pipe(
        take(1),
        map(booking => {
          this.bookings = [booking];
          this.bookingsHaveFinishedLoading = true;
          this.selectedBooking = booking;
          this.matchParticipants = this.selectedBooking.participants;
          this.matchUserGuests = [];
          this.goForward();
        })
      )
      .subscribe();
  }

  getBookings() {
    this.bookingsHaveFinishedLoading = false;
    this.bookingsSubscription$ = this.bookingService.getMyMatchableBookings(this.userId)
      .pipe(
        tap(data => {
          if (data !== undefined) {
            this.requestHasError = false;
            if (data['hydra:view']['hydra:next']) {
              this.hasNext = true;
              this.nextBookingPage = data['hydra:view']['hydra:next'];
              if (this.infiniteScroll) {
                this.infiniteScroll.complete();
                this.infiniteScroll.disabled = false;
              }
            } else {
              this.hasNext = false;
              if (this.infiniteScroll) {
                this.infiniteScroll.complete();
                this.infiniteScroll.disabled = true;
              }
            }
          } else {
            this.requestHasError = true;
          }
        }),
        map(response => formatResponse(response)),
        tap(bookings => {
          bookings.forEach(booking => {
            booking.duration = getDurationInMinutes(booking.startAt, booking.endAt);
            return booking;
          });
        }),
        catchError(error => {
          this.requestHasError = true;

          this.bookingsHaveFinishedLoading = true;
          return of(console.log(JSON.stringify('catchError error' + error, null, 4)));
        })
      )
      .subscribe(bookings => {
        this.bookings = bookings;
        this.bookingsHaveFinishedLoading = true;
      });
    this.subscriptions$.push(this.bookingsSubscription$);
  }

  loadMoreData() {
    // this.load(this.selectedView, false, this.nextPage);
    this.bookingService.getMyBookingsNextPage(this.nextBookingPage)
      .pipe(
        tap(data => {
          if (data !== undefined) {
            this.requestHasError = false;
            if (data['hydra:view']['hydra:next']) {
              this.hasNext = true;
              this.nextBookingPage = data['hydra:view']['hydra:next'];
              if (this.infiniteScroll) {
                this.infiniteScroll.complete();
                this.infiniteScroll.disabled = false;
              }
            } else {
              this.hasNext = false;
              if (this.infiniteScroll) {
                this.infiniteScroll.complete();
                this.infiniteScroll.disabled = true;
              }
            }
          } else {
            this.requestHasError = true;
          }
        }),
        map(response => formatResponse(response)),
        tap(bookings => {
          bookings.forEach(booking => {
            booking.duration = getDurationInMinutes(booking.startAt, booking.endAt);
            return booking;
          });
        }),
      )
      .subscribe(bookings => {
        this.bookings = [...this.bookings, ...bookings];
        this.bookingsHaveFinishedLoading = true;
      });
  }

  getActivityLevels(activityId) {
    this.levelsSubscription$ = this.levelService.getActivityLevels(activityId)
      .pipe(
        filter(levels => levels !== undefined)
      )
      .subscribe(levels => {
        this.activityLevels = levels;
        if (this.activityLevels.length) {
          const activityMinLevel = this.activityLevels[0]['identifier'];
          const activityMaxLevel = this.activityLevels[this.activityLevels.length - 1]['identifier'];
          this.matchLevels = { lower: activityMinLevel, upper: activityMaxLevel };
          this.rangeSteps = activityMaxLevel / this.activityLevels.length;
          this.selectedLevelsToDisplay = [
            {
              identifier: this.activityLevels[0].identifier,
              label: this.activityLevels[0].label,
              iri: this.activityLevels[0]['@id']
            },
            {
              identifier: this.activityLevels[this.activityLevels.length - 1].identifier,
              label: this.activityLevels[this.activityLevels.length - 1].label,
              iri: this.activityLevels[this.activityLevels.length - 1]['@id']
            }
          ];
        } else {
          this.activityLevels = [];
          this.selectedLevelsToDisplay = [];
        }
        this.levelsAreLoaded = true;

      });
    this.subscriptions$.push(this.levelsSubscription$);
  }

  restrictLevelChange(event) {
    this.restrictLevel = event;
    let userHasSelectedLevel;
    // this.userSelectedActivityLevel
    if (event === true) {
      this.userSelectedActivityLevel = this.checkUserActivityLevel(this.userActivityLevels);
      userHasSelectedLevel = this.checkIfUserHasLevel(this.userSelectedActivityLevel);
      if (!userHasSelectedLevel) {
        this.displayLevelRestrictionError = true;
      }
    } else {
      this.displayLevelRestrictionError = false;
      return;
    }
  }

  checkUserActivityLevel(userLevels) {
    const activityId = this.selectedBooking.activity['@id'];
    let activityLevels;
    let level;
    let levelNumber;
    if (userLevels !== undefined && userLevels !== null) {
      activityLevels = userLevels.find(userLevel => userLevel.activity['@id'] === activityId);
      if (activityLevels !== undefined && activityLevels['activityLevels'].length) {
        level = activityLevels['activityLevels'][0];
      } else {
        level = undefined;
      }
      if (level !== undefined) {
        levelNumber = level.identifier;
      } else {
        levelNumber = null;
      }
    } else {
      levelNumber = null;
    }
    return levelNumber;
  }

  checkIfUserHasLevel(levelNumber: number, selectedLevelsToDisplay?): boolean {
    if (levelNumber === undefined) {
      return false;
    } else if (selectedLevelsToDisplay !== undefined) {
      return levelNumber >= this.selectedLevelsToDisplay[0].identifier && levelNumber <= this.selectedLevelsToDisplay[1].identifier;
    } else if (this.matchLevels !== undefined && this.matchLevels.lower && this.matchLevels.upper) {
      return levelNumber >= this.matchLevels.lower && levelNumber <= this.matchLevels.upper;
    }
    return false;
  }

  selectBooking(booking) {
    if (booking.match === null || booking.match === undefined) {
      this.selectedBooking = booking;
      this.selectedBooking.userClient = '/user-clients/' + this.userId;
      this.matchParticipants = this.selectedBooking.participants;
      this.matchUserGuests = [];
      this.goForward();
    } else {
      this.selectedMatchId = booking.match.id;
      this.selectedMatchActivityId = booking.activity.id;
      this.goRoot(false);
    }
  }

  composeMatch(): void {

    const match = {};
    match['name'] = this.transitObject['matchName'];
    match['description'] = this.transitObject['matchInfos'];
    match['club'] = this.transitObject['selectedBooking']['club'];
    match['duration'] = this.transitObject['selectedBooking']['duration'];
    match['activity'] = this.transitObject['selectedBooking']['activity'];
    // overwrite activity levels with selected levels
    match['activityLevels'] = this.transitObject['levelsToDisplay'];
    match['participants'] = this.transitObject['matchParticipants'];
    match['maxParticipantsCountLimit'] = this.transitObject['selectedBooking']['maxParticipantsCountLimit'];
    match['participantsCount'] = this.transitObject['selectedBooking']['participantsCount'];
    match['userClient'] = this.transitObject['selectedBooking']['userClient'];
    match['price'] = this.transitObject['selectedBooking']['pricePerParticipant'];
    match['startAt'] = this.transitObject['selectedBooking']['startAt'];
    match['endAt'] = this.transitObject['selectedBooking']['endAt'];
    match['access'] = this.transitObject['restrictAccess'] === false ? 'public' : 'for_guest';
    match['activityLevelsRequired'] = this.transitObject['restrictLevel'];
    match['pricePerParticipant'] = this.transitObject['selectedBooking']['pricePerParticipant'];
    match['userGuests'] = this.transitObject['matchUserGuests'];


    this.match = Object.assign(match);
  }

  computeParticipantsData(): void {
    // Number of max tickets
    this.maxTickets = this.match.maxParticipantsCountLimit;
    // Number of booked tickets
    this.bookedTickets = this.match.participantsCount;
    // Number of available ticket
    this.availableTickets = this.maxTickets - this.bookedTickets;
    // Number of tickets booked by user
    this.userNbOfTickets = this.checkUserNumberOfTickets();
  }

  /* checkUserNumberOfTickets(): number {
    const matchingUsers = this.match.participants.filter(participant => {
      return participant.user.id === this.match.userClient.id;
    });
    return matchingUsers.length;
  } */

  checkUserNumberOfTickets(): number {
    let matchingParticipants;
    let count = 0;
    if (this.userId !== null && this.userId !== undefined) {
      matchingParticipants = this.match.participants.filter(participant => {
        // && participant.user === null
        if ((participant.addedBy !== undefined && participant.addedBy !== null) && participant.user === null && !participant.client) {
          return participant.addedBy['@id'] === `/user-clients/${this.userId}`;
        }
        return false;
      });
      if (matchingParticipants.length) {
        count = matchingParticipants.length + 1;
      } else if (this.match.participants.find(participant => participant.user !== null && (participant.user['@id'] === `/user-clients/${this.userId}`))) {
        count = 1;
      }
    }
    return count;
  }

  addParticipants() {
    if (this.availableTickets > 0) {
      this.match.participants.push(
          {
            user: null, addedBy: { '@id': (this.match.userClient['@id'] ? this.match.userClient['@id'] : this.match.userClient)
          }});
      this.match.participantsCount += 1;
      this.computeParticipantsData();
    } else {
      return;
    }
  }

  removeParticipants() {
    if (this.userNbOfTickets > 1) {
      const indexOfElToRemove = this.match.participants
        .indexOf(this.match.participants
          .find(participant => {
            if ((participant.addedBy !== undefined && participant.addedBy !== null) && participant.user === null && !participant.client) {
              return participant.addedBy['@id'] === this.match.userClient['@id'];
            }
            return false;
          })
        );
      if (indexOfElToRemove  !== -1) {
        this.match.participants.splice(indexOfElToRemove, 1);
        this.match.participantsCount -= 1;
        this.computeParticipantsData();
      }
    } else {
      return;
    }
  }

  addOrInviteFriends(action) {

    if (this.availableTickets > 0) {
      this.modalCtrl.create({
        component: SelectFriendsComponent,
        cssClass: 'friends-select-class',
        componentProps: {
          isCreationMode: this.isCreationMode,
          selectedFriends: action === 'add' ? this.match.participants : this.match.userGuests,
          maxAttenders: action === 'add' ? this.maxTickets : 1000,
          // attenders: this.match.participants,
          activityId: this.match.activity.id,
          activityLevels: this.activityLevels,
          matchLevels: this.match.activityLevels,
          levelRequired: this.match.activityLevelRequired,
          action: action === 'add' ? 'add' : 'invite',
          config: SelectFriendsConfig.MATCH_CREATE
        }
      }).then(mod => {
        mod.present();
        mod.onDidDismiss()
          .then(selectedFriends => {
            // this.attenders = data.data;
            if (action === 'add') {
              this.match.participants = selectedFriends.data;
              this.computeParticipantsData();
            } else {
              this.match.userGuests = selectedFriends.data;
            }
          });
      });
    } else {
      return;
    }
  }

  segmentChanged(event) {
    switch (event.detail.value) {
      case "attenders":
        this.displayAttenders = true;
        this.displayInvitations = false;
        break;
      case 'invited':
        this.displayAttenders = false;
        this.displayInvitations = true;
        break;
      default:
        this.displayAttenders = true;
        this.displayInvitations = false;
        break;
    }
  }

  rangeValuesChanged(event): void {
    const values = event.detail.value;
    const selectedLowerLevel = this.activityLevels.find(level => level.identifier === values.lower);
    const selectedUpperLevel = this.activityLevels.find(level => level.identifier === values.upper);
    this.selectedLevelsToDisplay = [selectedLowerLevel, selectedUpperLevel];
    if (this.restrictLevel) {
      const userHasSelectedLevel = this.checkIfUserHasLevel(this.userSelectedActivityLevel, this.selectedLevelsToDisplay);
      if (!userHasSelectedLevel) {
        this.displayLevelRestrictionError = true;
      } else {
        this.displayLevelRestrictionError = false;
      }
    }
  }

  goForward() {
    if (this.step === 1) {
      const selectedLowerLevel = this.activityLevels.find(level => level.identifier === this.matchLevels.lower);
      const selectedUpperLevel = this.activityLevels.find(level => level.identifier === this.matchLevels.upper);

      if (selectedLowerLevel !== undefined && selectedUpperLevel !== undefined) {
        this.selectedLevelsToDisplay = [selectedLowerLevel, selectedUpperLevel];
      } else {
        this.selectedLevelsToDisplay = [];
      }

      if ((this.activityLevels === undefined || (this.matchName === '' || this.matchName === undefined))) {
        this.displayMissingNameError = true;
        return;
      } else {
        this.displayMissingNameError = false;
      }

      if (this.displayLevelRestrictionError) {
        return;
      }
    }

    this.transitObject = {
      userId: this.userId,
      matchName: this.matchName,
      matchInfos: this.matchInfos,
      matchLevels: this.matchLevels,
      restrictLevel: this.restrictLevel,
      restrictAccess: this.restrictAccess,
      activityLevels: this.activityLevels,
      matchUserGuests: this.matchUserGuests,
      selectedBooking: this.selectedBooking,
      participantsCount: this.participantsCount,
      matchParticipants: this.matchParticipants,
      pricePerParticipant: this.pricePerParticipant,
      levelsToDisplay: this.selectedLevelsToDisplay,
      maxParticipantsCountLimit: this.maxParticipantsCountLimit
    };

    if (this.step !== 2) {
      this.nav.push(this.nextPage,
        {
          step: this.step + 1,
          transitObject: this.transitObject
        }
      );
    } else {
      this.submitMatch();
    }
  }

  prepareMatchData() {
    const attenders = [];
    let data;
    let levels: Array<string> = new Array<string>();
    let addedUnderUserName;
    let friendsAdded;
    let guests;
    if (this.match.activityLevels !== undefined && this.match.activityLevels.length) {
      for (let index = 0; index < this.match.activityLevels.length; index++) {
        const level: ActivityLevel = this.match.activityLevels[index];
        if (level !== undefined) {
          levels.push(level["@id"]);
        }
      }
    } else {
      levels = [];
    }

    addedUnderUserName = this.match.participants
      .filter(participant => participant.addedBy
          && !participant.user && !participant.client)
      .filter(participant =>
          this.match.userClient &&
          (participant.addedBy['@id'] === this.match.userClient || participant.addedBy['@id'] === this.match.userClient['@id']));
    // .splice(1, this.match.participants.length);
    friendsAdded = this.match.participants
      .filter(participant => participant.user || participant.client)
      .filter(participant => {
        return this.match.userClient
            && ((participant.user !== this.match.userClient['@id'] || participant.client !== this.match.userClient['@id'])
                || (participant.user !== this.match.userClient || participant.client !== this.match.userClient));
      });
    // attenders.push({user: this.match.userClient["@id"]});

    let me;

    this.selectedBooking['participants'].forEach(participant => {
      if (participant['client'] && this.match.userClient) {
        if (
            (this.match.userClient && participant['user']
              && (participant['user']['@id'] === this.match.userClient['@id'] || participant['user']['@id'] === this.match.userClient))
            ) {
          me = participant['@id'];
        }
      }
    });
    if (addedUnderUserName.length > 0) {
      const dataUnder = {
        user: this.match.userClient["@id"] ? this.match.userClient["@id"] : this.match.userClient,
        accompanyingParticipants: [],
        bookingParticipant: me,
      };
      addedUnderUserName.forEach(() => {
        dataUnder.accompanyingParticipants.push({ customData: [] });
      });
      attenders.push(dataUnder);

    } else {
      attenders.push({
        user: this.match.userClient["@id"] ? this.match.userClient["@id"] : this.match.userClient,
        bookingParticipant: me,
        accompanyingParticipants: []
      });
    }


    friendsAdded.forEach(participant => {
      if (participant['@id'] !== me) {
        if (participant['@id'] !== undefined) {
          if (participant['user']) {
            attenders.push(
                {
                  user: participant.user['@id'],
                  bookingParticipant: participant['@id']
                });
          } else {
            attenders.push(
                {
                  client: participant.client['@id'],
                  bookingParticipant: participant['@id']
                });
          }
        }
      }
    });

    guests = this.match.userGuests.map(guest => {
      return {
        userClient: guest.user['@id'],
        // invitedBy: this.selectedBooking.userClient["@id"]
      };
    });
    data = {
      name: this.match.name,
      access: this.match.access,
      activityLevelRequired: this.transitObject.restrictLevel, // this.match.activityLevelRequired,
      activityLevels: levels,
      booking: this.selectedBooking["@id"],
      userClient: this.match.userClient['@id'] ? this.match.userClient['@id']  : this.match.userClient,
      participants: attenders,
      creationOrigin: this.env.useMb ? 'white_label_app' : 'doinsport_app'
    };
    if (this.match.description.length > 0) {
      data.description = this.match.description;
    }
    if (guests.length) {
      data.guests = guests;
    }
    return data;
  }

  submitMatch() {
    // TODO: implement match creation
    this.loadComplete = false;
    this.createMatchError = false;
    this.matchSubmitted = true;
    const matchData = this.prepareMatchData();
    // this.matchStore.dispatch(MatchActions.createMatch({matchData}));

    // TODO: unsubscribe()
    // TODO: put back after test
    this.matchService.createMatch(matchData)
      .subscribe(response => {
        if (response !== undefined) {
          this.createdMatch = response;
          this.loadComplete = true;
          const date = moment(this.selectedBooking.startAt).minute(0).hour(0).second(0).millisecond(0).utc(true);
          this.store.dispatch(new SelectedDateActions.AddSelectedDate(date));
          this.createMatchError = false;
        } else {
          this.loadComplete = true;
          this.createMatchError = true;
        }
      });
  }

  onScreenTapped() {
    this.matchSubmitted = false;
    let matchCreated;
    if (this.createMatchError === false) {
      matchCreated = true;
    } else {
      matchCreated = false;
    }
    this.goRoot(matchCreated);
  }

  goRoot(matchCreated: boolean) {
    this.nav.popToRoot().then(() => {
      this.close(matchCreated);
    });
  }

  close(matchCreated: boolean) {
    if (matchCreated === false) {
      this.modalController.dismiss({ matchCreated, matchId: this.selectedMatchId, activityId: this.selectedMatchActivityId });
    } else {
      this.modalController.dismiss({ matchCreated, matchId: this.createdMatch.id, activityId: this.createdMatch.activity.id });
    }
  }
}
