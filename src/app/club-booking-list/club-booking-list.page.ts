import {Component, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaygroundService } from '../shared/services/playground/playground.service';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { Playground } from '../shared/models/playground';
import * as moment from 'moment';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import {IonRouterOutlet, ModalController, InfiniteScrollCustomEvent} from '@ionic/angular';
import { ModalBaseComponent } from '../components/modal-base/modal-base.component';
import { ModalContentComponent } from '../components/modal-content/modal-content.component';

import { BookingSuccesModalComponent } from './components/booking-succes-modal/booking-succes-modal.component';
import { BookingService } from '../shared/services/booking/booking.service';
import { ModalService } from '../shared/services/modal.service';
import { EnvironmentService } from "../shared/services/environment/environment.service";
import { ClubState } from '../club/store/club.reducers';
import {getCurrentClub} from '../club/store';
import { Preferences } from '@capacitor/preferences';
import { BookingDetailComponent } from '../modal/booking/booking-detail/booking-detail.component';
import {Filter} from "../shared/models/filter";
import * as FilterActions from "../state/actions/filter.actions";
import {ActivityService} from "../shared/services/activity/activity.service";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../shared/services/user/auth.service";
import {UserTokenService} from "../shared/services/storage/user-token.service";
import {LoaderService} from "../shared/services/loader/loader.service";
import * as AccountActions from "../account/store/account.actions";

@Component({
  selector: 'app-club-booking-list',
  templateUrl: './club-booking-list.page.html',
  styleUrls: ['./club-booking-list.page.scss'],
})
export class ClubBookingListPage implements OnInit, OnDestroy {
  @Input() guid: string;
  @Input() clubName: string;
  @Input() categoryId: string = null;
  @Input() selectedActivityId: string = null;
  @Input() from: string;
  @ViewChild('contentScroll') private contentScroll: any;


  // currenciesUrl = 'assets/currencies.json';
  // currencies: any;
  env;
  playgrounds: Playground[];
  activitySelectedId: string;
  surfacesSelectedIds: string[] = [];
  environmentSelected: string;
  surfaceSelected: string;
  showSkeletonPlayground: boolean;
  minDuration: Observable<number>;
  date: any;
  times: Array<any>;
  setTimes = true;
  selectedTime: any;
  reloadSchedule: boolean = false;
  displayBookingSuccess: boolean;
  bookingIRI: string;
  refreshViewSub$ = new BehaviorSubject<boolean>(false);
  refreshView$ = this.refreshViewSub$.asObservable();
  groupedBy: Array<any> = [];
  clubDetails: any;
  clubCurrency: string;
  clubTimezone: string;

  isMultiSchedule: boolean = false;

  openningHour: string;
  closingHour: string;

  dateSubscription$: Subscription;
  initSubs$: Subscription;
  lastCoursesLength = 0;
  dateSubs$: Subscription;
  playgroundsSub: Subscription;
  coursSub: Subscription;
  clubCurrencySub: Subscription;
  clubTimezoneSub: Subscription;

  coursSelected = false;
  eventSelected = false;
  coursAvailable = false;
  allCourses: any = [];
  itemsPerPage: number = 5;

  filterSelected: any;
  keyCloack

  isBySlot: boolean = true;

  loaderView: boolean = false;

  constructor(
      private route: ActivatedRoute,
      private playgroundService: PlaygroundService,
      private store: Store<AppState>,
      private router: Router,
      private modalController: ModalController,
      private routerOutlet: IonRouterOutlet,
      private bookingService: BookingService,
      private activityService: ActivityService,
      private modalService: ModalService,
      private environmentService: EnvironmentService,
      private clubStore: Store<ClubState>,
      private accountStore: Store<any>,
      private cookieService: CookieService,
      private authService: AuthService,
      private userToken: UserTokenService,
      public loaderService: LoaderService,
  ) {
    this.env = this.environmentService.getEnvFile();
    this.minDuration = of(900);
    this.store.select('selectedDate')
        .pipe(first())
        .subscribe(date => {
          if(moment().diff(date, 'hours') < 1) {
            this.selectedTime = date;
          } else {
            this.selectedTime = moment();
            this.selectedTime.minutes(0).seconds(0);
          }
        });
  }


  ngOnInit() {
    this.loaderView = true;
    this.clubName = this.route.snapshot.queryParams.name;
    this.from = this.route.snapshot.queryParams.from;
    this.guid = this.route.snapshot.queryParams.guid;
    this.categoryId = this.route.snapshot.queryParams.categoryId;
    this.selectedActivityId = this.route.snapshot.queryParams.activitySelectedId;
    if (this.selectedActivityId) {
      this.selectedActivityId = this.selectedActivityId.replace(/"/g, "");
    } else {
      this.selectedActivityId = null;
    }
    if (this.initSubs$) {
      this.initSubs$.unsubscribe();
    }

    this.initSubs$ = this.clubStore.select(getCurrentClub).pipe(tap(club => {
      this.clubDetails = club;
      if(this.clubDetails && this.clubDetails.id) {
        console.log(this.clubDetails, "okok  le clubdétails<== ???")
        this.guid = club.id;
        this.clubTimezone = club.timezone;
        this.clubCurrency = club.currency;
        this.isBySlot = true;
        this.keyCloack = this.cookieService.get('Token_Keycloak');
        if (this.keyCloack && this.keyCloack !== 'Error') {
          this.loaderService.presentLoading();
          this.authService.signInUserCloack(this.keyCloack).subscribe(
              tokens  => {
                if (tokens) {
                  this.userToken.add(tokens).then(() => {
                    this.authService.getConnectedUser()
                        .subscribe(async (data) => {
                          await this.accountStore.dispatch(AccountActions.setMe({ data }));
                          this.loaderService.dismiss();
                          this.loadSchedule(club);
                        });
                  });
                }
              },
              err => console.error(err),
              () => this.loaderService.dismiss()
          );
        }

        if(this.selectedActivityId) {
          this.store.select('filter')
              .pipe(first()).subscribe((filters) => {
            let activitySelected = null;
            filters.forEach(item => {
              if (item.keyFilter === 'ACTIVITY') {
                activitySelected = item.label;
              }
            });

            if(!activitySelected) {
              this.activityService.get(`/activities/${this.selectedActivityId}`)
                  .pipe(first())
                  .subscribe((data) => {
                    console.log(data, "ça passe pourtant <==== ?")
                    const filter: Filter = <Filter>{
                      keyFilter: 'ACTIVITY',
                      value: this.selectedActivityId,
                      label: data.name,
                      category: 'PLAYGROUND'
                    };

                    this.store.dispatch(new FilterActions.ClearFilters());
                    this.store.dispatch(new FilterActions.Addfilter(filter));
                    this.loadSchedule(club);
                  })
            } else {
              this.loadSchedule(club);
            }
          })
        } else {
          this.loadSchedule(club);
        }

        if (this.environmentService.isPasserelle()) {
          // this.isBySlot = true;
          // this.isMultiSchedule = false;
          // this.clubDetails.appSportTimetableTypes = [];
        }
        if (this.from === 'cat-courses') {
        } else if (this.from === 'sport') {

        }
        // club.appSportTimetableTypes = ["planning", "slots"];
      }
    })).subscribe();
    this.dateSubscription$ = this.store.select('selectedDate').pipe(tap(date => {
      if (date) {
        this.date = date;
      } else {
        this.date = moment();
      }
    })).subscribe();
  }

  async ionViewWillEnter() {
    this.loaderView = false;
  }

  loadSchedule(club) {
    console.log(this.from, "aller le from <====")
    Preferences.get({key: 'schedule-type'}).then(data => {
      if (this.from === 'cat-courses') {
        this.isMultiSchedule = false;
        this.coursSelected = true;
      } else if (this.from === 'cat-events') {
        this.isMultiSchedule = false;
        this.eventSelected = true;
      } else {
        this.coursSelected = false;
        if (this.clubDetails.appSportTimetableTypes && this.clubDetails.appSportTimetableTypes.length > 1) {
          this.isMultiSchedule = true;
        } else if (!this.clubDetails.appSportTimetableTypes || (this.clubDetails.appSportTimetableTypes.length === 1 && club.appSportTimetableTypes[0] === 'planning')) {
          this.isMultiSchedule = false;
          this.isBySlot = false;
        }
      }
      if (data && this.from !== "cat-courses" && this.from !== "cat-events") {
        console.log(this.clubDetails.appSportTimetableTypes, "<=== this.clubDetails.appSportTimetableTypes 2")
        switch (data.value) {
          case 'schedule-type':
            if(this.clubDetails.appSportTimetableTypes.length === 1 && club.appSportTimetableTypes[0] === 'planning') {
              this.isBySlot = false;
            } else if(this.clubDetails.appSportTimetableTypes.length > 1) {
              this.isBySlot = false;
            } else {
              Preferences.set({key: 'schedule-type', value: 'slots'}).then();
            }
            break;
          default:
            if(this.clubDetails.appSportTimetableTypes.length === 1 && club.appSportTimetableTypes[0] === 'classic') {
              this.isBySlot = true;
            } else if(this.clubDetails.appSportTimetableTypes.length > 1) {
              this.isBySlot = true;
            } else {
              this.isBySlot = false;
              Preferences.set({key: 'schedule-type', value: 'schedule-type'}).then();
            }
            break;
        }
      }

      this.loadPlayground().then();
    });
  }

  changeTypeSchedule() {
    this.isBySlot = !this.isBySlot;
    Preferences.set({key: 'schedule-type', value: (this.isBySlot ? 'slots' : 'schedule-type')}).then();
    this.loadPlayground().then();
  }
  reload($event) {
    if (this.loaderView) {
      return;
    }
    if (this.dateSubs$) {
      this.dateSubs$.unsubscribe();
    }
    this.store.select('selectedDate')
        .pipe(first())
        .subscribe(date => {
          if (date) {
            this.date = date;
            this.selectedTime = moment(moment(date).format('YYYY-MM-DD') + ' ' + this.selectedTime.format('HH:mm'));
          } else {
            this.date = moment();
          }

          this.loadPlayground($event).then();
        });
  }

  async loadPlayground($event?) {
    this.showSkeletonPlayground = this.eventSelected && $event ? false : true;
    this.allCourses = this.eventSelected && $event ? this.allCourses : [];
    this.playgrounds = [];
    this.groupedBy = [];
    this.activitySelectedId = null;
    this.surfacesSelectedIds = [];
    this.activitySelectedId = undefined;
    this.environmentSelected = undefined;
    this.surfaceSelected = undefined;
    this.store.select('filter')
        .subscribe(filters => {
          filters.forEach(item => {
            switch (item.keyFilter) {
              case 'ACTIVITY':
                this.activitySelectedId = item.value;
                break;
              case 'ENVIRONMENT':
                this.environmentSelected = item.value;
                break;
              case 'SURFACE':
                this.surfaceSelected = item.value;
                break;
            }
          });
        });
    const hour = this.selectedTime.get('hour');
    const minutes = this.selectedTime.get('minutes');
    let start = null;
    let end = '23:59:59';
    let startDate = moment();
    if (this.selectedTime.format('YYYYMMDD') === startDate.format('YYYYMMDD')) {

      startDate = this.selectedTime;

      start = startDate.format('HH:mm');
      const endHour = hour + 4;
      end = '23:59:59';
      if (endHour < 24) {
        end = endHour + ':29:00';
      }

    } else {


      start = (minutes >= 0 && minutes < 30) ? hour + ':00:00' : hour + ':30:00';
      // const end = (minutes >= 0 && minutes < 30) ? hour + ':59:00' : (hour + 1) + ':29:00';
      const endHour = hour + 4;
      end = '23:59:59';
      if (endHour < 24) {
        end = endHour + ':29:00';
      }
    }
    if (!this.isBySlot) {
      start = '00:00:00';
      end = '23:59:59';
    }

    if (this.coursSelected || this.eventSelected) {
      if (($event !== undefined && $event['data'] !== undefined) || this.filterSelected != null) {
        if ($event !== undefined  && $event['data'] !== undefined && $event['data']['filter'] != null) {
          this.filterSelected = $event.data.filter;
          await this.bookingService.getCourses(this.date.format('YYYY-MM-DD'), this.guid,  this.filterSelected, this.categoryId, this.eventSelected, this.itemsPerPage).toPromise().finally(() => {
            //this.infiniteScroll.complete();
          });
          this.allCourses = this.allCourses.sort((a, b) => a.startAt.localeCompare(b.startAt));
          this.allCourses =  this.allCourses.filter(x => new Date(x.startAt) > new Date());
        } else {
          this.filterSelected = null;
          this.allCourses = await this.bookingService.getCourses(this.date.format('YYYY-MM-DD'), this.guid, null, this.categoryId, this.eventSelected, this.itemsPerPage).toPromise().finally(() => {
            //this.infiniteScroll.complete();
          });
          this.allCourses = this.allCourses.sort((a, b) => a.startAt.localeCompare(b.startAt));
          this.allCourses =  this.allCourses.filter(x => new Date(x.startAt) > new Date());
        }
      } else {
        this.filterSelected = null;
        this.allCourses = await this.bookingService.getCourses(this.date.format('YYYY-MM-DD'), this.guid, null, this.categoryId, this.eventSelected, this.itemsPerPage).toPromise().finally(() => {
          //this.infiniteScroll.complete();
          if($event && this.eventSelected) {
            ($event as InfiniteScrollCustomEvent).target.complete().then(() => {
              if(this.lastCoursesLength < this.allCourses.length) {
                this.contentScroll.scrollByPoint(-50, -500, 5);
              }
              this.lastCoursesLength = this.allCourses.length;
            });
          }
        });

        if(!this.eventSelected) {
          this.allCourses = this.allCourses.sort((a, b) => a.startAt.localeCompare(b.startAt));
          this.allCourses =  this.allCourses.filter(x => new Date(x.startAt) > new Date());
        }
      }
    }

    console.log("le dernier load ====> ", this.activitySelectedId)
    this.playgroundsSub =
        this.playgroundService.getClubPlaygroundsWithTimeTable(
            this.guid, this.date.format('YYYY-MM-DD'),
            start, end, this.activitySelectedId, this.environmentSelected, this.surfaceSelected, 'unique').pipe(
            tap(data => {
              if (data) {
                this.initPlaygroundData(data);
              }
              this.showSkeletonPlayground = false;
            })
        ).subscribe();
  }

  initPlaygroundData(playgrounds: Playground[]) {
    this.playgrounds = playgrounds;
    this.playgrounds.forEach((_element, index) => {
      this.playgrounds[index].activities = Object.values(this.playgrounds[index].activities);
    });
    if (this.playgrounds[0]) {
      this.initOpeningClosingHours();
    }

  }

  initOpeningClosingHours() {
    this.openningHour = this.playgrounds.reduce(
        (minHour, playground) => {
          return (playground.timetables.startAt && playground.timetables.startAt < minHour) ? playground.timetables.startAt : minHour;
        }, this.playgrounds[0].timetables.startAt
    );
    this.closingHour = this.playgrounds.reduce(
        (maxHour, playground) => {
          return (playground.timetables.endAt && playground.timetables.endAt > maxHour) ? playground.timetables.endAt : maxHour;
        }, this.playgrounds[0].timetables.endAt
    );
  }

  changeSelectedTime(event) {
    this.selectedTime = event;
    this.reloadSchedule = true;
  }

  changeCours(event) {
    this.coursSelected = event.coursSelected;
    if (this.coursSelected) {

    }
  }

  setMinStep($event) {
    this.minDuration = of((this.minDuration > $event) ? $event : this.minDuration);
    this.setTimes = true;
  }

  dealWithCreateBookingResponse(event) {
    if (event.success === true) {
      this.displayBookingSuccess = true;
      this.bookingIRI = event.bookingIRI;
      this.refreshViewSub$.next(true);
      this.modalController.create({
        component: BookingSuccesModalComponent,
        componentProps: {
          bookingIRI: this.bookingIRI,
          booking: event.booking,
          club: this.clubDetails,
        },
        animated: true
      })
          .then(modal => {
            modal.onDidDismiss()
                .then(data => {
                  if (data.data['createMatch'] !== undefined && data.data['createMatch'] === true) {
                    this.goCreateMatch();
                  } else if (data.data['createMatch'] !== undefined && data.data['createMatch'] === false) {
                    this.presentBookingDetailsModal();
                  }
                });
            modal.present();
          });
    } else {
      // TODO: redirect to home
    }
  }

  loadMoreData(event) {
    this.itemsPerPage += 5;
    this.loadPlayground(event);
  }

  goCreateMatch() {
    this.displayBookingSuccess = false;
    this.modalController
        .create({
          presentingElement: this.routerOutlet.nativeEl,
          component: ModalBaseComponent,
          cssClass: 'base-class',
          componentProps: {
            rootPage: ModalContentComponent,
            bookingIRI: this.bookingIRI
          },
          animated: true
        })
        .then(modal => {
          modal.onDidDismiss()
              .then(data => {
                if (data.data && data.data.matchCreated === true) {
                  this.router.navigate(['matches'], { queryParams: { matchId: data.data.matchId, activityId: data.data.activityId } });
                }
              });
          modal.present();
        });
  }

  presentBookingDetailsModal() {
    this.modalService.presentBookingDetailmodal(BookingDetailComponent, this.bookingIRI);
  }

  onScreenTapped() {
    // TODO: redirect home
  }

  ngOnDestroy(): void {
    if (this.initSubs$) {
      this.initSubs$.unsubscribe();
    }
    if (this.dateSubs$) {
      this.dateSubs$.unsubscribe();
    }
    if (this.playgroundsSub) {
      this.playgroundsSub.unsubscribe();
    }
    if (this.clubCurrencySub) {
      this.clubCurrencySub.unsubscribe();
    }
    if (this.clubTimezoneSub) {
      this.clubTimezoneSub.unsubscribe();
    }
  }
}
