import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EnvironmentService} from "../../../../services/environment/environment.service";
import {BookingService} from "../../../../services/booking/booking.service";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {Booking} from "../../../../models/booking";
import * as moment from 'moment';
import {iif, Observable, of, Subject} from "rxjs";
import {ManagePaymentService} from "../../../../services/payment/manage-payment.service";
import {Cart} from "../../../../models/cart";
import { ClubState } from 'src/app/club/store/club.reducers';
import { Store } from '@ngrx/store';
import { getClubPhoto } from 'src/app/club/store';
import { ClubPhoto } from 'src/app/club/models/club-photo';

@Component({
  selector: 'app-payment-recap',
  templateUrl: './payment-recap.component.html',
  styleUrls: ['./payment-recap.component.scss']
})
export class PaymentRecapComponent implements OnInit, OnDestroy {

  @Input() selectedPlayground;
  @Input() booking;
  @Input() activity;
  @Input() duration;
  @Input() club: any;
  @Input() slot: any;
  @Input() methods: any;
  @Input() wallet;

  @Output() closeModal = new EventEmitter();

  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  showPaymentSelection = false;

  startAt;
  endAt;

  baseUrl: string;
  initedBooking: Booking;

  createdCart: Cart;

  loader = true;
  photoUrl: Observable<string | undefined> = undefined;

  constructor(
    private environmentService: EnvironmentService,
    private bookingService: BookingService,
    private managePaymentService: ManagePaymentService,
    private storeClub: Store<ClubState>
    ) {
    this.baseUrl = this.environmentService.getEnvFile().domainAPI;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.initBooking();
    this.photoUrl = iif(() => this.selectedPlayground?.photos[0]?.contentUrl,
    of(this.selectedPlayground?.photos[0]?.contentUrl as string),
    this.storeClub.select(getClubPhoto).pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((clubPhoto: ClubPhoto) => of(clubPhoto.contentUrl))
    ))
    console.log(this.selectedPlayground);
  }

  initBooking() {
    this.booking.playgrounds = [this.booking.playgrounds[0]['@id']];
    this.booking.paymentMethod = this.methods[0];
    this.booking.participants.map((participant) => {
      participant.subscriptionCard = (participant.subscriptionCard) ? (participant.subscriptionCard['@id'] ? participant.subscriptionCard['@id'] : participant.subscriptionCard ) : undefined;
    });
    this.bookingService.createBooking(this.booking, this.club.timezone)
        .pipe(
            takeUntil(this.ngUnsubscribe),
            tap(respBook => {
              this.initedBooking = respBook;
              this.startAt = moment(this.initedBooking.startAt).tz(this.club.timezone).format('HH:mm');
              this.endAt = moment(this.initedBooking.endAt).tz(this.club.timezone).format('HH:mm')
              this.loader = false;
            }),
          switchMap(booking => {
            return iif(() => booking,
              this.managePaymentService.createCart({
                items: [{
                  product: booking['@id'],
                  price: booking.price
                }]
              }),
              of(null)
            );
          }),
            tap((cart: any) => {
              if (cart) {
                this.createdCart = cart;
              }
            }))
        .subscribe();
  }

  switchPaymentModal(event) {
    this.showPaymentSelection = !this.showPaymentSelection;
    if (event?.success) {
      console.log("emit ciicci 2 event", event)
      this.closeModal.emit(event);
    }
  }

}
