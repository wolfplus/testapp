import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, Subject } from 'rxjs';
import { Booking } from '../../../shared/models/booking';
import { Period } from 'src/app/shared/enums/period';

@Component({
  selector: 'app-last-course',
  templateUrl: './last-course.component.html',
  styleUrls: ['./last-course.component.scss'],
})
export class LastCourseComponent implements OnInit, OnDestroy {
  @Input() refresh$: Observable<boolean> = of(false);
  @Input() noChange: boolean = false;
  @Output() noBooking = new EventEmitter<boolean>();
  @Output() refreshMatches = new EventEmitter<any>(false);
  @Input() clubSelected: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();

  // refresh$: Observable<boolean>;
  updateBookingsSub$ = new BehaviorSubject(false);
  updateBookings$ = this.updateBookingsSub$.asObservable();
  showSkeleton = true;
  bookings: Booking[];
  nextBookings: Booking[];
  pastBookings: Booking[];
  isConnected: boolean;
  subscription$: Subscription;
  Period = Period;
  clubId:any;

  slideOpt ={
    slidesPerView: 1
  }

  slideOptTablet = {
    slidesPerView: 4
  }

  constructor() {
    this.bookings = [];
    this.isConnected = false;
  }

  ngOnInit() {
    // this.load();
    this.resetFormSubject.subscribe(response => {
      if (response){
        // this.load();
      }
   });
  }

  // async load() {
  //   this.showSkeleton = true;
  //   this.nextBookings = [];
  //   this.pastBookings = [];
  //   this.bookings = [];

  //   this.store.select('user').subscribe(
  //     async (user) => {
  //       if(user !== undefined && user !== null) {
  //         let clubId = await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
  //         let stream1 = await this.bookingService.getMyBookings2(false, Period.NEXT, 5, this.noChange ? null : clubId, user.id).toPromise();
  //         let stream2 = await this.bookingService.getMyBookings2(false, Period.PAST, 5, this.noChange ? null : clubId, user.id).toPromise();

  //         this.nextBookings = stream1['hydra:member'];
  //         this.pastBookings = stream2['hydra:member'];

  //         if (this.nextBookings !== undefined && this.nextBookings.length) {
  //           this.bookings = [...this.nextBookings];
  //         } else if (this.pastBookings !== undefined && this.pastBookings.length && this.nextBookings.length === 0) {
  //           this.bookings = [...this.pastBookings];
  //         }

  //         if (this.bookings.length === 0) {
  //           this.noBooking.emit(true);
  //         } else {
  //           this.noBooking.emit(false);
  //         }
  //       }
  //       this.bookings.sort(function(a,b){
  //         return new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  //       })
  //       this.showSkeleton = false;
  //     });
  // }

  ngOnDestroy() {
    if (this.subscription$ !== undefined) {
      this.subscription$.unsubscribe();
    }
  }

  ionViewDidEnter() {
  }

  reload() {
    this.updateBookingsSub$.next(true);
    this.refreshMatches.emit(true);
  }
}
