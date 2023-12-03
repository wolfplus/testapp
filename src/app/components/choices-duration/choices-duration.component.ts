import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ModalController} from "@ionic/angular";
import * as moment from 'moment';
import { getClubCurrency } from 'src/app/club/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-choices-duration',
  templateUrl: './choices-duration.component.html',
  styleUrls: ['./choices-duration.component.scss']
})
export class ChoicesDurationComponent implements OnInit {

  @Input() slot;
  @Input() startAt;
  @Input() playgroundName;
  @Input() bookings;
  @Input() dataSlots;
  @Input() club;
  public currency$: Observable<string>;

  constructor(
      private modalController: ModalController,
      private clubStore: Store<ClubState>,
  ) { }

  ngOnInit(): void {
    this.currency$ = this.clubStore.pipe(
      select(getClubCurrency)
    );
  }

  isBookableTime(price) {
    const booking = this.bookings ? this.bookings.sort((r1, r2) => (r1.startAt > r2.startAt) ? 1 : (r1.startAt < r2.startAt) ? -1 : 0) : false;
    const nextBooking = booking ? booking.find((x) => x.startAt > this.slot.startAt) : false;
    const slotsBetween = [];

    if(!nextBooking) {
      return true;
    }

    for(const item of this.dataSlots) {
      if(item.startAt > this.slot.startAt && item.startAt < nextBooking.startAt) {
        slotsBetween.push(item.userClientStepBookingDuration);
      } else if(item.startAt === this.slot.startAt) {
        slotsBetween.push(item.userClientStepBookingDuration);
      }
    }

    if(!slotsBetween.length) {
      return false;
    }

    const availableTime = slotsBetween.reduce((a, b) => a + b);


    if(availableTime >= price.duration) {
      return true;
    }

    return false;
  }

  availablePrices() {
    const prices = [];
    console.log(this.bookings, "<==== this.bookingsOrder");
    this.slot.prices.forEach(item => {

      // const start = moment(this.startAt.format('YYYY-MM-DD HH:mm'));
      const end = moment(this.startAt.format('YYYY-MM-DD HH:mm'));
      end.add(item.duration, 'seconds');
      let validation = true;
      console.log(this.isBookableTime(item));
      if(!this.isBookableTime(item)) {
        validation = false;
      }

      if (validation) {
        const exist = prices.find((x) => x.duration === item.duration);

        if(!exist) {
          prices.push(item);
        }
      }
    });
    
    return prices.sort((a, b) => a.duration - b.duration);
  }
  selectDuration(duration) {
    this.modalController.dismiss({duration, success: true}).then();
  }

}
