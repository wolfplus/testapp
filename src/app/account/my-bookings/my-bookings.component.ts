import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {filter, tap} from 'rxjs/operators';
import { Period } from 'src/app/shared/enums/period';
import { User } from 'src/app/shared/models/user';
import { AppState } from 'src/app/state/app.state';
import { BookingService } from '../../shared/services/booking/booking.service';
import * as SortEvents from 'src/app/shared/helpers/sort-events-by-date';
import { ModalService } from 'src/app/shared/services/modal.service';

import {EnvironmentService} from "../../shared/services/environment/environment.service";
import { ClassDetailComponent } from 'src/app/club-booking-list/components/class-detail/class-detail.component';
import { BookingDetailComponent } from 'src/app/modal/booking/booking-detail/booking-detail.component';
import {CookieService} from 'ngx-cookie-service';
import { AuthService } from '../../shared/services/user/auth.service';
import { UserTokenService } from '../../shared/services/storage/user-token.service';
import {LoaderService} from "../../shared/services/loader/loader.service";
import {getCurrentClub} from "../../club/store";
import {ClubState} from "../../club/store/club.reducers";
import * as AccountActions from "../store/account.actions";


@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit, AfterViewInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  env;
  user: User;
  bookings: Array<any> = [];
  selectedView: string;
  showSkeleton: boolean;
  displayErrorMessage: boolean;
  hasNext: boolean;
  nextPage: any;
  keyCloack
  pastBookings: any[];
  club: any;
  isAllin: boolean = false;
  pastBookingsByDate: any[];
  yesterdayBookings: any[];
  todayBookings: any[];
  tomorrowBookings: any[];
  otherDaysBookings: any[];
  otherDaysBookingsByDate: any[];
  displayNoMatchMessage: boolean;

  constructor(
    private modalCtrl: ModalController,
    private bookingService: BookingService,
    private store: Store<AppState>,
    private modalService: ModalService,
    private environmentService: EnvironmentService,
    private cookieService: CookieService,
    private authService: AuthService,
    private userToken: UserTokenService,
    public loaderService: LoaderService,
    private clubStore: Store<ClubState>,
    private accountStore: Store<any>,
  ) {
    this.env = this.environmentService.getEnvFile();
    this.selectedView = 'next';
    this.pastBookings = [];
    this.pastBookingsByDate = [];
    this.yesterdayBookings = [];
    this.todayBookings = [];
    this.tomorrowBookings = [];
    this.otherDaysBookings = [];
    this.otherDaysBookingsByDate = [];
    this.hasNext = false;
    this.nextPage = null;
  }

  ngOnInit(): void {
    this.keyCloack = this.cookieService.get('Token_Keycloak');
    if (this.keyCloack && this.keyCloack !== 'Error') {
      this.showSkeleton = true;
      this.loaderService.presentLoading();
      this.authService.signInUserCloack(this.keyCloack).subscribe(
          tokens  => {
            if (tokens) {
              this.userToken.add(tokens).then(() => {
                this.authService.getConnectedUser()
                    .subscribe(async (data) => {
                      await this.accountStore.dispatch(AccountActions.setMe({ data }));
                      this.loaderService.dismiss();
                      this.load(this.selectedView, true);
                    });
              });
            }
          },
          err => console.error(err),
          () => this.loaderService.dismiss()
          );
    } else {
      this.load(this.selectedView, true);
    }
  }

  ngAfterViewInit() {
    this.modalService.refreshView$.pipe(
      filter(Boolean),
      tap( () => this.load('next', true))
    )
    .subscribe();
  }

  segmentChanged(event) {
    this.selectedView = event.detail.value;
    this.load(event.detail.value, true);
  }

  async openBooking(booking) {
    if (booking.activityType === 'lesson' || booking.activityType === 'event') {
      this.modalService.courseDetailsModal(ClassDetailComponent, booking, this.user).then(mod => {
        mod.onDidDismiss();
      });
    } else {
      await this.modalService.presentBookingDetailmodal(BookingDetailComponent, booking['@id']);
    }
  }

  returnRequest(status: Period, nextPage?) {
    const isAllin = this.environmentService.getEnvFile().marqueBlanche.clubIds[0] === '18c52639-e8e9-4f98-b2fa-9189d81fe5d1';
    if (nextPage) {
      return this.bookingService.getMyBookingsNextPage(nextPage);
    } else {
      if (status === 'canceled') {
        return this.bookingService.getMyBookings(this.club, true, status, null, null, this.user.id, "DESC", isAllin);
      } else {
        return this.bookingService.getMyBookings(this.club,false, status, null, null, this.user.id, status === "next" ? "ASC" : "DESC", isAllin);
      }
    }
  }

  load(status, reset = true, nextPage = null ) {
    this.displayErrorMessage = false;
    // TODO: unsubscribe from OBSERVABLES in OnDestroy
    if (reset) {
      this.bookings = [];
      this.showSkeleton = true;
      this.pastBookings = [];
      this.pastBookingsByDate = [];
      this.yesterdayBookings = [];
      this.todayBookings = [];
      this.tomorrowBookings = [];
      this.otherDaysBookings = [];
      this.otherDaysBookingsByDate = [];
      this.hasNext = false;
      this.nextPage = null;
    }

    this.store.select('user').subscribe(
      async (userClient) => {
        this.user = userClient;
        if (userClient !== null) {
          await this.clubStore.pipe(select(getCurrentClub), tap(async club => {
            if (club && club.id) {
              this.club = club;
              const data = await this.returnRequest(status, nextPage).toPromise();
              if (data !== undefined) {
                if (data['hydra:view']['hydra:next']) {
                  this.hasNext = true;
                  this.nextPage = data['hydra:view']['hydra:next'];
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

                if (reset) {
                  this.bookings = data['hydra:member'];
                } else {
                  this.bookings = [...this.bookings, ...data['hydra:member']];
                }
                if (this.bookings.length === 0) {
                  this.displayNoMatchMessage = true;
                } else {
                  const sorted = SortEvents.byDate(this.bookings, status);
                  // this.sortByDate(this.matches, Period.CANCELED);
                  this.pastBookings = sorted.pastEvents;
                  this.pastBookingsByDate = sorted.pastEventsByDate;
                  this.yesterdayBookings = sorted.yesterdayEvents;
                  this.todayBookings = sorted.todayEvents;
                  this.tomorrowBookings = sorted.tomorrowEvents;
                  this.otherDaysBookings = sorted.otherDaysEvents;
                  this.otherDaysBookingsByDate = sorted.otherDaysEventsByDate;
                  this.displayNoMatchMessage = false;
                }
                this.showSkeleton = false;
              } else {
                this.bookings = [];
                this.displayErrorMessage = true;
              }
            }
          })).subscribe();
        }
    });
  }

  loadMoreData() {
    this.load(this.selectedView, false, this.nextPage);
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }
}
