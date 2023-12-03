import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BookingService} from "../../shared/services/booking/booking.service";
import {tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../../state/app.state";
import {Subscription} from "rxjs";
import * as moment from 'moment';
import {ModalController} from "@ionic/angular";
import {ChoicesDurationComponent} from "../choices-duration/choices-duration.component";
import {SignComponent} from "../../modal/auth/sign/sign.component";
import {ModalService} from "../../shared/services/modal.service";
import {Filter} from "../../shared/models/filter";
import * as FilterActions from "../../state/actions/filter.actions";
import {EnvironmentService} from "../../shared/services/environment/environment.service";
import { BookingSportPage } from 'src/app/modal/booking/booking-sport/booking-sport.page';

@Component({
  selector: 'app-schedule-sport',
  templateUrl: './schedule-sport.component.html',
  styleUrls: ['./schedule-sport.component.scss']
})
export class ScheduleSportComponent implements OnInit, OnDestroy {

  @Input() playgrounds = null;
  @Input() activityId = '';
  @Input() selectedTime;
  @Input() reload = false;
  @Input() club = null;
  @Output() bookingSuccess = new EventEmitter();

  dateSubs$: Subscription;
  bookingSubs$: Subscription;
  userSubscription$: Subscription;
  durationStep = 60;
  dataSlots = [];
  dataClosedSlots = [];
  multiplicateur = 1;
  selectedPlayground = null;
  bookings = null;
  selectedDate = null;
  env = null;
  timeline = [];
  bookingsOrder = [];

  constructor(
      private bookingService: BookingService,
      private store: Store<AppState>,
      private modalService: ModalService,
      private modalCtr: ModalController,
      private envService: EnvironmentService,
      private modalController: ModalController
  ) {
    this.env = this.envService.getEnvFile();
  }

  ngOnInit(): void {

    if (this.selectedDate === null) {
      this.selectedDate = this.selectedTime;
    }

    this.selectedTime.hours(8);
    this.reload = false;
    this.dateSubs$ = this.store.select('selectedDate')
        .pipe(tap(date => {
          this.selectedDate = date;
          this.selectedTime = date;

          if (this.playgrounds) {
            if (this.playgrounds.length > 0) {
              this.selectedPlayground = this.playgrounds[0];
              this.loadData();
            }
          }

        }))
        .subscribe();
  }

  loadData() {
    this.availableSlots();
    this.loadPlaygroundBookings();
  }

  isShowingSlot(startAt) {
    console.log(this.bookings, "this.bookings <====");
    const startAtOrder = this.getOrder(startAt);
    if(!this.bookings) {
      return true;
    }

    for(const item of this.bookings) {
      const startAtOrderBooking = this.getOrder(item.startAt);
      const endAtOrderBooking = this.getOrder(item.endAt);
      if(startAtOrder >= startAtOrderBooking && startAtOrder < endAtOrderBooking) {
        return false;
      }
    }

    return true;
  }
  loadPlaygroundBookings() {
    const startAt = moment(this.selectedTime.format('YYYY-MM-DD') + ' ' + this.selectedPlayground.timetables.startAt).tz(this.club.timezone, true);
    const endAt = moment(this.selectedTime.format('YYYY-MM-DD') + ' ' + this.selectedPlayground.timetables.endAt).tz(this.club.timezone, true);

    if (endAt.unix() < startAt.unix()) {
      endAt.add(1, 'day');
    }

    this.bookingService.getPlaygroundPlanningBookings(
        this.selectedPlayground.id,
        startAt.utc().format('YYYY-MM-DD HH:mm'),
        endAt.utc().format('YYYY-MM-DD HH:mm')
    )
        .pipe(tap(data => {
          this.bookingsOrder = [];
          if (data) {
            if (data["hydra:member"]) {
              const bookings = [];
              data["hydra:member"].forEach(item => {
                const duration = moment(item.endAt).diff(moment(item.startAt), 'seconds');
                bookings.push({
                  name: item.name,
                  duration: duration,
                  startAt: moment(item.startAt).tz(this.club.timezone).format('HH:mm'),
                  endAt: moment(item.endAt).tz(this.club.timezone).format('HH:mm'),
                  participants: item.participants
                });
                this.bookingsOrder.push({
                  start: this.getOrder(moment(item.startAt).tz(this.club.timezone).format('HH:mm')),
                  end: this.getOrder(moment(item.endAt).tz(this.club.timezone).format('HH:mm')),
                });
              });

              this.bookings = bookings;
            }
          }
        }))
        .subscribe();
  }

  getOrder(timeString, withTz = false) {
    let date = moment();
    if (this.selectedDate) {
      date = moment(this.selectedDate);
    }
    const dateItem = moment(date.format('YYYY-MM-DD') + ' ' + timeString);
    if (withTz) {
      dateItem.tz(this.club.timezone);
    }
    return dateItem.unix();
  }

  nextPlayground() {
    if (this.playgrounds.length > 0) {
      let currentIndex = 0;
      this.playgrounds.forEach((playground, index) => {
        if (playground.id === this.selectedPlayground.id) {
          currentIndex = index;
        }
      });
      if ((currentIndex + 1) === this.playgrounds.length) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      this.selectedPlayground = this.playgrounds[currentIndex];
      this.loadData();
    }
  }

  prevPlayground() {
    if (this.playgrounds.length > 0) {
      let currentIndex = 0;
      this.playgrounds.forEach((playground, index) => {
        if (playground.id === this.selectedPlayground.id) {
          currentIndex = index;
        }
      });
      if (currentIndex === 0) {
        currentIndex = this.playgrounds.length - 1;
      } else {
        currentIndex--;
      }
      this.selectedPlayground = this.playgrounds[currentIndex];
      this.loadData();
    }
  }

  availableSlots() {
    let data = [];
    if (this.activityId === null || this.activityId === undefined) {
      if (this.selectedPlayground.activities.length > 0) {
        this.activityId = this.selectedPlayground.activities[0].id;
        const filter: Filter = <Filter>{
          keyFilter: 'ACTIVITY',
          value: this.activityId,
          label: this.selectedPlayground.activities[0].name,
          category: 'PLAYGROUND'
        };
        this.store.dispatch(new FilterActions.Addfilter(filter));
      }
    }
    this.selectedPlayground.activities.forEach(activity => {
        data = activity.slots;
        if (data) {
          if (data.length > 0) {
            this.durationStep = null;
            activity.slots.forEach(slot => {
              if ((slot.userClientStepBookingDuration / 60) < this.durationStep || this.durationStep === null) {
                this.durationStep = (slot.userClientStepBookingDuration / 60);
              }
            });

            if (this.durationStep === null) {
              this.durationStep = 60;
            }
          }
        }
    });

    this.loadTimeline();
    this.dataSlots = data;
    this.generateClosedSlot();
  }

  loadTimeline() {
    this.timeline = [];
    const timeStart = moment(this.selectedTime.format('YYYY-MM-DD') + ' ' + this.selectedPlayground.timetables.startAt).tz(this.club.timezone, true);
    const timeEnd = moment(this.selectedTime.format('YYYY-MM-DD') + ' ' + this.selectedPlayground.timetables.endAt).tz(this.club.timezone, true);
    timeStart.tz(this.club.timezone);
    timeEnd.tz(this.club.timezone);

    if (timeEnd < timeStart) {
      timeEnd.add(1, 'day');
    }

    while (timeStart < timeEnd) {
      this.timeline.push(timeStart.format('HH:mm'));
      timeStart.add(this.durationStep, 'minutes');
    }
  }

  getSizeBloc() {
    let size = this.durationStep;
    this.multiplicateur = 1;
    if (this.durationStep < 100) {
      while (size < 100) {
        this.multiplicateur++;
        size = this.multiplicateur * this.durationStep;
      }
    }
    return size;
  }

  getSizeBlocSlot(slot) {
    return (( slot.userClientStepBookingDuration / 60) * this.multiplicateur);
  }

  getSizeBlocBooking(booking) {
    return (( booking.duration / 60) * this.multiplicateur);
  }

  isBookableTime(slot) {
    if (this.selectedTime.format('YYYYMMDD') === moment().format('YYYYMMDD')) {
      const currentTime = moment();
      const startAt = moment(slot.startAt, 'HH:mm');
      if(currentTime.isAfter(startAt)) {
        return false;
      }
    }
    if(!slot.prices || (slot.prices && slot.prices.length === 0)) {
      return false;
    }

    const lowestDuration = slot.prices.reduce((prev, curr) => prev.duration < curr.duration ? prev : curr).duration;
    const booking = this.bookings ? this.bookings.sort((r1, r2) => (r1.startAt > r2.startAt) ? 1 : (r1.startAt < r2.startAt) ? -1 : 0) : false;
    const nextBooking = booking ? booking.find((x) => x.startAt > slot.startAt) : false;
    const slotsBetween = [];

    if(!nextBooking) {
      return true;
    }

    for(const item of this.dataSlots) {
      if(item.startAt > slot.startAt && item.startAt < nextBooking.startAt) {
        slotsBetween.push(item.userClientStepBookingDuration);
      } else if(item.startAt === slot.startAt) {
        slotsBetween.push(item.userClientStepBookingDuration);
      }
    }

    if(!slotsBetween.length) {
      return false;
    }

    const availableTime = slotsBetween.reduce((a, b) => a + b);

    if(availableTime >= lowestDuration) {
      return true;
    }

    return false;
  }

  choicesDuration(slot) {

    if (!this.isBookableTime(slot)) {
      return;
    }

    let date = moment();
    if (this.selectedDate) {
      date = moment(this.selectedDate);
    }
    const dateSlot = moment(date.format('YYYY-MM-DD') + ' ' + slot.startAt);

    this.modalController.create({
      component: ChoicesDurationComponent,
      backdropDismiss: true,
      cssClass: 'choices-duration-class',
      initialBreakpoint: 0.35,
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        slot,
        startAt: dateSlot,
        club: this.club,
        dataSlots: this.dataSlots,
        bookings: this.bookings,
        playgroundName: this.selectedPlayground.name
      }
    }).then(modal => {
      modal.present().then();
      modal.onDidDismiss().then(res => {
        if (res.data) {
          if (res.data.success) {
            this.openBooking(res.data.duration, slot);
          }
        }
      });
    });

  }

  openBooking(duration, slotData) {

    this.userSubscription$ = this.store.select("user")
        .pipe(tap(user => {
          if(user === undefined || user === null) {
            this.modalCtr
                .create({
                  component: SignComponent,
                  cssClass: 'sign-class'
                })
                .then(mod => {
                  mod.present().then();
                });
          } else {
            slotData.selectTime = this.selectedTime.date(this.selectedDate.date());
            slotData.selectTime = this.selectedTime.month(this.selectedDate.month());
            slotData.selectTime = this.selectedTime.year(this.selectedDate.year());
            this.modalService.bookingSportModal(
                BookingSportPage,
                slotData,
                this.selectedPlayground,
                duration,
                {id: this.activityId},
                slotData.prices)
                .then(mod => {
                  mod.onDidDismiss().then(data => {
                    if (data.data !== undefined && data.data['success'] === true) {
                      this.bookingSuccess.emit({success: true, bookingIRI: data.data['booking']['@id']});
                    } else {
                      this.bookingSuccess.emit({success: false, bookingIRI: null});
                    }
                  });
                  mod.present().then();
                  this.userSubscription$.unsubscribe();
                });
          }
        }))
        .subscribe();
  }

  generateClosedSlot() {
    this.dataClosedSlots = [];
    const startAt = moment(this.selectedTime.format('YYYY-MM-DD') + ' ' + this.selectedPlayground.timetables.startAt);
    const endAt = moment(this.selectedTime.format('YYYY-MM-DD') + ' ' + this.selectedPlayground.timetables.endAt);
    startAt.tz(this.club.timezone, true);
    endAt.tz(this.club.timezone, true);

    if (endAt < startAt) {
      endAt.add(1, 'day');
    }

    while (startAt < endAt) {
      const slotEnd = startAt.clone();
      slotEnd.add(this.durationStep, 'minutes');

      let test = true;
      if (this.dataSlots) {
        this.dataSlots.forEach(item => {
          const itemStart = moment(startAt.format('YYYY-MM-DD') + ' ' + item.startAt).tz(this.club.timezone, true);
          const slotTestEnd = startAt.clone();
          slotTestEnd.add(item.userClientStepBookingDuration, 'minutes');
          if (itemStart <= startAt && slotTestEnd > startAt) {
            test = false;
          }
        });
      }

      if (test && (startAt.clone()).format('HH:mm') !== '00:00') {
        this.dataClosedSlots.push({
          startAt: (startAt.clone()).format('HH:mm'),
          userClientStepBookingDuration: this.durationStep * 60,
          endAt: (slotEnd.clone()).format('HH:mm')
        });
      }

      startAt.add(this.durationStep, 'minutes');
    }
  }

  ngOnDestroy() {
    if (this.bookingSubs$) {
      this.bookingSubs$.unsubscribe();
    }
    if (this.dateSubs$) {
      this.dateSubs$.unsubscribe();
    }
  }
}
