import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment-timezone';
import {ModalService} from '../../../shared/services/modal.service';
import {Playground} from '../../../shared/models/playground';
import {SlotBlock} from '../../../shared/models/slot-block';
import {animate, style, transition, trigger} from '@angular/animations';
import {Subject, Subscription} from 'rxjs';
import { AuthService } from 'src/app/shared/services/user/auth.service';
import { SignComponent } from 'src/app/modal/auth/sign/sign.component';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { BookingSportPage } from 'src/app/modal/booking/booking-sport/booking-sport.page';
import {getCurrentMe} from "../../../account/store";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../account/store/account.actions";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-card-playground',
  templateUrl: './card-playground.component.html',
  styleUrls: ['./card-playground.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0, height: 48}),
            animate('0.4s ease-out',
              style({ opacity: 1, height: 96 }))
          ]
        )
      ]
    )
  ]
})
export class CardPlaygroundComponent implements OnInit {

  constructor(
    private modalService: ModalService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private accountStore: Store<any>,
    private modalCtrl: ModalController
  ) {
    this.showSkeletonSlot = true;
    this.guid = this.route.snapshot.queryParams.guid;
  }

  @Input() clubTimeZone: string;
  @Input() clubCurrency: string;
  @Input() playground: any;
  @Input() activity: any;
  @Input() date: any;
  @Input() selectedTime: any;
  @Output() setMinStep = new EventEmitter<number>();
  @Output() bookingSuccess = new EventEmitter<any>();

  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  userSubscription$: Subscription;
  showSkeletonSlot: boolean;
  showFirstOrNext = null;
  modifiedActivity: any;
  guid:any;

  filteredSlots: SlotBlock[];

  source: Subscription;

  userMe:any;

  ngOnInit() {
    this.showFirstOrNext = null;
    if (this.activity.slots) {
      this.activity.slots = this.activity.slots.sort((a, b) => (a.startAt > b.startAt) ? 1 : -1);
      this.activity.slots.forEach((slot) => {
        slot.prices = slot.prices.sort((a, b) => (a.duration > b.duration) ? 1 : -1);
      });
      this.filterSlotAvailable(this.activity.slots);
    }

  }

  getMinPrice(prices: any): number{
    const bookablePrices = prices.filter(price => price.bookable);
    return bookablePrices.reduce((min: number, p: { pricePerParticipant: number, participantCount: number }) =>
      (p.pricePerParticipant * p.participantCount) < min ?
        p.pricePerParticipant * p.participantCount :
        min, prices[0].pricePerParticipant * prices[0].participantCount);
  }

  getTimeFormat(datetime) {
    return moment(datetime).format('HH:mm');
  }

  async openBooking(slotData: any, playground: Playground, duration: number, activity: any, blockPrice: any) {
    this.accountStore.select(getCurrentMe).pipe(tap(data => {
      this.userMe = data;
      if(!this.userMe) {
        this.modalCtrl
            .create({
              component: SignComponent,
              cssClass: 'sign-class'
            })
            .then(mod => {
              mod.present().then(() => {
                mod.onDidDismiss().then(async () => {
                  this.userMe = await this.authService.getConnectedUser(this.guid).toPromise();
                  await this.accountStore.dispatch(AccountActions.setMe({ data: this.userMe }));
                });
              });
            });
      } else {
        try {
          this.userSubscription$.unsubscribe();
        } catch {
          console.log("can't unsubscribe");
        }
        slotData.selectTime = this.selectedTime.date(this.date.date());
        slotData.selectTime = this.selectedTime.month(this.date.month());
        slotData.selectTime = this.selectedTime.year(this.date.year());
        this.modalService.bookingSportModal(BookingSportPage, slotData, playground, duration, activity, blockPrice)
            .then(mod => {
              mod.onDidDismiss().then(data => {
                if (data.data !== undefined && data.data['success'] === true) {
                  this.bookingSuccess.emit({success: true, bookingIRI: data.data['booking']['@id'], booking: data.data.booking});
                } else {
                  this.bookingSuccess.emit({success: false, bookingIRI: null});
                }
              });
              mod.present().then();
            });
      }
    }), takeUntil(this.ngUnsubscribe)).subscribe();
  }

  openSlotData(pos) {
    this.filteredSlots.forEach((slot, index) => {
      slot.isOpen = (pos === index);
    });
  }

  isSomeSlotsAreAvailables(slots: SlotBlock[]): boolean {
    if (slots) {
      let isBookable = false;
      for (const slot of slots) {
        isBookable = isBookable || this.isSlotAvailable(slot);
      }
      return isBookable;
    } else {
      return false;
    }
  }
  showSlot(slot, index) {
    if (this.showFirstOrNext === null) {
      this.showFirstOrNext = slot;
      this.showFirstOrNext.index = index;
      return true;
    } else {
      const dateMin = moment('1970-01-01 ' + this.showFirstOrNext.startAt);
      const dateMax = moment('1970-01-01 ' + this.showFirstOrNext.startAt).add(30, 'minutes');
      if (dateMin > dateMax) {
        dateMax.add(1, 'day');
      }
      const date = moment('1970-01-01 ' + slot.startAt);
      if (date >= dateMin && date < dateMax) {
        // this.showFirstOrNext = slot;
        this.showFirstOrNext.index = index;
        return true;
      }
    }
    return false;
  }
  isSlotAvailable(slot: SlotBlock): boolean{
    return slot.prices.some(price => price.bookable);
  }

  filterSlotAvailable(slots: SlotBlock[]): any{
    this.filteredSlots = slots.filter(slot => this.isSlotAvailable(slot));
    if (this.filteredSlots[0]) {
      this.filteredSlots[0].isOpen = true;
    }
  }

  filterSameDuration(prices) {
    const sortedArray = prices.sort((a, b) =>
      ((a.pricePerParticipant * a.participantCount) - (b.pricePerParticipant * b.participantCount)));
    let  groupedByDurationMap = sortedArray.reduce((result, currentObject) => {
      const val = currentObject['duration'];
      result[val] = result[val] || [];
      result[val].push(currentObject);
      return result;
    }, {});
    groupedByDurationMap = Object.values(groupedByDurationMap).map((item: any) => {
      return item.sort((a, b) => a.participantCount - b.participantCount);
    });
    return Object.values(groupedByDurationMap).map(price => price[0]);
  }

  isMoreThanOnePrice(slot) {
    return slot.prices.filter(price => price.bookable).lenght > 1;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

