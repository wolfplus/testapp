import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, Subject } from 'rxjs';
import { BookingCardConfig } from '../../../shared/models/booking';
import { Period } from 'src/app/shared/enums/period';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-last-booking',
  templateUrl: './last-booking.component.html',
  styleUrls: ['./last-booking.component.scss'],
})
export class LastBookingComponent implements OnDestroy, ViewWillEnter {
  @Input() refresh$: Observable<boolean> = of(false);
  @Input() noChange: boolean = false;
  @Input() userMe: any;
  @Input() bookings: any;
  @Input() nextBookings: any;
  @Input() pastBookings: any;
  @Output() noBooking = new EventEmitter<boolean>();
  @Output() refreshMatches = new EventEmitter<any>(false);
  @Input() clubSelected: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();

  // refresh$: Observable<boolean>;
  updateBookingsSub$ = new BehaviorSubject(false);
  updateBookings$ = this.updateBookingsSub$.asObservable();
  showSkeleton = true;
  isConnected: boolean;
  subscription$: Subscription;
  Period = Period;
  clubId: any;
  slideOpt = {
    slidesPerView: 2
  };

  slideOptTablet = {
    slidesPerView: 4
  };

  BookingCardConfig = BookingCardConfig;

  constructor() {
    this.isConnected = false;
  }

  ionViewWillEnter() {
    if (this.bookings){
      this.showSkeleton = false;
    }

  }

  ngOnDestroy() {
    if (this.subscription$ !== undefined) {
      this.subscription$.unsubscribe();
    }
  }

  reload() {
    this.updateBookingsSub$.next(true);
    this.refreshMatches.emit(true);
  }
}
