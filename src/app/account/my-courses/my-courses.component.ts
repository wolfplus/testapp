import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/models/user';
import { BookingService } from '../../shared/services/booking/booking.service';
import * as SortEvents from 'src/app/shared/helpers/sort-events-by-date';

import {EnvironmentService} from "../../shared/services/environment/environment.service";
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import {getCurrentMe} from "../store";
import {tap} from "rxjs/operators";
import {Store} from "@ngrx/store";


@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  env;
  user: User;
  bookings: Array<any> = null;
  selectedView: string;
  showSkeleton: boolean;
  displayErrorMessage: boolean;
  hasNext: boolean;
  nextPage: any;
  pastBookings: any[];
  pastBookingsByDate: any[];
  yesterdayBookings: any[];
  todayBookings: any[];
  tomorrowBookings: any[];
  otherDaysBookings: any[];
  otherDaysBookingsByDate: any[];
  displayNoMatchMessage: boolean;
  guid: any;
  userMe: any;

  constructor(
      private modalCtrl: ModalController,
      private bookingService: BookingService,
      private clubIdStorageService: ClubIdStorageService,
      private accountStore: Store<any>,
      private environmentService: EnvironmentService,
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

  async ngOnInit() {
    this.guid = await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
    this.userMe = this.accountStore.select(getCurrentMe).pipe(tap(resp => {
          this.userMe = resp
          this.load(this.selectedView, true).then();
        }
    ));
  }


  // ngAfterViewInit() {
  //   this.modalService.refreshView$.pipe(
  //     filter(Boolean),
  //     tap( refresh => this.load('next', true))
  //   )
  //   .subscribe();
  // }

  segmentChanged(event) {
    this.selectedView = event.detail.value;
    this.load(event.detail.value, true);
  }


  async load(status, reset = true, nextPage = null ) {
    this.showSkeleton = true;
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

    if (this.userMe !== null) {

      let data:any;

      if (nextPage) {
        data = await this.bookingService.getMyCoursessNextPage(nextPage).toPromise();
      } else {
        if (status === 'canceled') {
          data = await this.bookingService.getMyCourses(true, status, this.userMe.id).toPromise();
        } else {
          data = await this.bookingService.getMyCourses(false, status, this.userMe.id).toPromise();
        }
      }

      if (data !== undefined) {
        if (data['hydra:view'] !== undefined) {
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

        this.bookings = data['hydra:member'];
        if (this.selectedView === 'next') {
          this.bookings = this.bookings.filter((item) => item.participantsCount != 0);
        }

        if (this.selectedView === 'past') {
          this.bookings = this.bookings.filter((item) => new Date(item.startAt) <= new Date(Date.now()));
        }

        this.bookings.sort((a, b) => {return  a.startAt -  b.startAt});

        if (this.bookings.length === 0) {
          this.displayNoMatchMessage = true;
        } else {
          const sorted = SortEvents.byDate(this.bookings, status);
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


  }

  refresh($event) {
    if ($event) {
      this.load(this.selectedView, true).then();
    }
  }

  loadMoreData() {
    this.load(this.selectedView, false, this.nextPage);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
