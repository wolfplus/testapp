import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Booking } from '../../../shared/models/booking';
import { PlaygroundService } from '../../../shared/services/playground/playground.service';
import { ManagePaymentService } from '../../../shared/services/payment/manage-payment.service';
import { Payment } from '../../../shared/models/payment';
import { ClientClub } from '../../../shared/models/client-club';
import { Cart } from '../../../shared/models/cart';
import { ToastService } from '../../../shared/services/toast.service';
import { AccountService } from '../../../shared/services/account/account.service';
import { BookingService } from '../../../shared/services/booking/booking.service';
import { StripeService } from '../../../shared/services/payment/stripe.service';
import { AttenderBooking } from '../../../shared/models/attender-booking';
import { User } from '../../../shared/models/user';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { PaymentCard } from 'src/app/shared/models/payment-card';
import { PaymentCardService } from 'src/app/shared/services/storage/payment-card.service';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {last, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {getCurrentClub} from "../../../club/store";
import {of, Subject} from "rxjs";
import {Store} from "@ngrx/store";
import {ClubState} from "../../../club/store/club.reducers";

@Component({
  selector: 'app-booking-attender-payment',
  templateUrl: './booking-attender-payment.component.html',
  styleUrls: ['./booking-attender-payment.component.scss']
})
export class BookingAttenderPaymentComponent implements OnInit {
  methods: Array<string>;
  prices: any;
  wallet: any;
  restToPay: number;
  timetableBlockPrice: any;
  selectedMethod: string;
  paymentLoading: boolean = false;
  cart: Cart;
  payments: Array<Payment>;
  defaultCard: PaymentCard;
  client: ClientClub;
  env: any;
  club: any;
  selectedProvider: string = 'stripe';
  restToPayCart: any;
  paid: boolean = true;
  webStripeElementCompleted: any;
  currency: string;
  @Input() booking: Booking;
  @Input() participant: AttenderBooking;
  @Input() user: User;
  @Input() stripeAccountReference: string;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();



  constructor(
    private modalCtr: ModalController,
    private playgroundService: PlaygroundService,
    private paymentCardService: PaymentCardService,
    private managePayment: ManagePaymentService,
    private toastService: ToastService,
    private bookingService: BookingService,
    private stripeService: StripeService,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private platform: Platform,
    private envService: EnvironmentService,
    private clubStore: Store<ClubState>,
  ) {
    this.env = this.envService.getEnvFile();
    this.stripeService.reloadStripeAccount();
    this.methods = [];
  }

  ngOnInit(): void {
    this.club = this.booking.club
    this.clubStore.select(getCurrentClub).pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(club => {
          this.club = club;
          console.log("club", club);

          if (this.club.photos && this.club.photos[0]) {
            return of(this.club.photos[0].contentUrl);
          }
          return of("");
        }));
    this.restToPayCart = this.participant.restToPay;
    this.client = this.participant.client;
    if (!this.client) {
      this.client = this.participant.client;
    }
    if (!this.user) {
      this.user = this.participant.user;
    }
    this.accountService.getWallets().subscribe(wallets => {
        wallets['hydra:member'].map(wallet => {
          if (wallet.club['@id'] === this.booking.club['@id']) {
            this.client.wallet = wallet;
          }
        });
    });
    this.currency = this.booking.club.currency;
    this.selectedMethod = this.booking.paymentMethod;
    this.methods.push(this.selectedMethod);
    if (this.booking.timetableBlockPrice) {
      this.playgroundService.getTimetableBlockPrice(this.booking.timetableBlockPrice['@id']).subscribe(data => {
        if (data) {
          this.timetableBlockPrice = data;
          this.prices = data.paymentTokenPrices;
        }
      });
    } else {
      // TODO : Error no timetableBlockPrice
    }
    this.init();
  }

  init() {
    this.paymentCardService.getDefaultPaymentCard()
      .then(cardsString => {
        this.defaultCard = null;
        const arrayData: Array<PaymentCard> = JSON.parse(cardsString.value);
        if (arrayData) {
          arrayData.forEach(item => {
            if (item.default) {
              this.defaultCard = item;
            }
          });
        }
        if (this.defaultCard === null && !this.platform.is('desktop') && !this.platform.is('mobileweb')) {
          this.toastService.presentError('missing_default_card_payment', 'top');
          return;
        }
      });

      this.managePayment.createCart({
        items: [{
          product: this.booking['@id'],
          price: this.restToPay
        }]
      }).subscribe(data => {
        this.cart = data;
      });
  }

  close(paid: boolean = false) {
    const payments = [];
    this.booking.payments.forEach(payment => {
      if (payment["@id"]) {
        payments.push(payment);
      }
    });
    this.booking.payments = payments;
    this.modalCtr.dismiss({
      booking: this.booking,
      paid
    }).then();
  }

  changeMethod(event) {
    this.selectedMethod = event;
  }

  getPayments(event) {
    this.booking.payments = event.booking.payments;
    this.calculateRestToPay();
  }

  addCredit(event) {
    this.calculateRestToPay();
    // let userClientIri = this.booking.userClient;
    // if (this.booking.userClient['@id']) {
    //   userClientIri = this.booking.userClient['@id'];
    // }
    let clientId = null;
    if (this.client['@id']) {
      clientId = this.client['@id'];
    }
    const payment: Payment = {
      amount: event.paymentTokenPrice.pricePerParticipant,
      cart: this.cart['@id'],
      client: clientId,
      currency: this.currency,
      method: 'card',
      provider: 'payment_token',
      userClient: this.booking.userClient,
      metadata: {
        paymentTokenId: event.paymentTokenPrice.paymentToken.id
      }
    };
    if (this.booking.payments === undefined) {
      this.booking.payments = [];
    }
    this.booking.payments.push(payment);
    this.calculateRestToPay();
  }

  confirmPayments(_type: string = 'completed') {
    if(this.paymentLoading) {
      return;
    }
    this.loaderService.presentLoading();
    this.paymentLoading = true;
    this.calculateRestToPay();
    const booking = this.bookingService.serializeBooking(this.booking);
    let clientId = null;
    if (this.client) {
      clientId = this.client['@id'];
    }
    let paymentsSent = 0;
    this.booking.payments.forEach(paym => {
      if (paym["@id"]) {
        paymentsSent += 1;
      }
    });

    console.log(this.selectedProvider, "this.selectedProvider <====")

    if(this.selectedProvider === "stripe") {
      const payment: /*Payment*/ any = {
        amount: this.restToPay,
        client: this.client['@id'],
        cart: this.cart['@id'],
        currency: this.currency,
        method: 'card',
        provider: 'stripe',
        userClient: this.user,
        captureMethod: null
      }
      this.booking.payments.push(payment);
    }
    this.managePayment.sendPayments(this.booking.payments, clientId)
        .pipe(
            tap(resp => {
              if (resp && (resp.status === 'succeeded' || resp.status === 'processing')) {
                paymentsSent += 1;
              }
            }),
            last(),
            map(resp => {
              if (resp) {
                if (paymentsSent === this.booking.payments.length) {
                  this.calculateRestToPay();
                  return {status: 'succeeded'};
                } else {
                  resp.status = 'error';
                  return resp;
                }
              }
            })
        )
        .subscribe((paymentData) => {
          console.log(paymentData, "<=== paymentData.status")
          if (this.restToPay > 0 && paymentData.status === 'succeeded') {
            this.managePayment.createPaymentBooking(
                booking,
                this.cart,
                'stripe',
                'card',
                this.currency,
                this.restToPay,
                this.client["@id"],
                this.user['@id']
            )
            .subscribe(payment => {
              this.stripeService.clientSecret = payment.metadata.clientSecret;

              if (this.platform.is("desktop") || this.platform.is("mobileweb")) {
                this.stripeService.confirmWebPayment()
                    .then(res => {
                      if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
                        this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                          this.toastService.presentSuccess('payment_booking_succeeded');
                          this.loaderService.dismiss();
                          this.paymentLoading = false;
                        });
                      }
                    }).catch(() => {
                  this.loaderService.dismiss();
                  this.paymentLoading = false;
                });
              } else {
                this.stripeService.confirmPayment(this.defaultCard, this.stripeAccountReference, this.client["@id"])
                    .then(res => {
                      if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
                        this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                          this.toastService.presentSuccess('payment_booking_succeeded');
                          this.loaderService.dismiss();
                          this.paymentLoading = false;
                        });
                      }
                    }).catch(() => {
                  this.loaderService.dismiss();
                  this.paymentLoading = false;
                });
              }

            });
          } else if (paymentData.status === 'succeeded') {
            this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
              this.toastService.presentSuccess('payment_booking_succeeded');
              this.loaderService.dismiss();
              this.paymentLoading = false;
            });
          } else if (paymentData.status === 'error') {
            console.log('ERROR', paymentData);
          }
        });

  }

  calculateRestToPay() {
    let amount = 0;
    amount = this.participant.restToPay;

    if (this.booking.payments !== undefined) {
      this.booking.payments.forEach(payment => {
        if (!payment['@id']) {
          switch (payment.provider) {
            case 'payment_token':
              amount = amount - this.booking.pricePerParticipant;
              break;
            case 'wallet':
              amount = amount - payment.amount;
              break;
          }
        }
      });
    }
    this.restToPay = amount;

    if (this.restToPay > 0 && this.selectedMethod !== 'on_the_spot') {
      this.webStripeElementCompleted = false;
    } else if (this.selectedMethod === 'on_the_spot') {
      this.webStripeElementCompleted = true;
    } else if (this.restToPay <= 0) {
      this.webStripeElementCompleted = true;
    }
  }

  removePaiement(i) {
    const newPayments = [];
    this.booking.payments.forEach((item, index) => {
      if (index !== i) {
        newPayments.push(item);
      }
    });
    this.booking.payments = newPayments;
    this.calculateRestToPay();
  }



  changeProvider(event) {
    this.selectedProvider = event;
  }

  triggerPaymentData(result) {
    this.webStripeElementCompleted = result;
  }

  updateSelectedCard(event) {
    this.defaultCard = event;
    this.stripeService.setCard(this.defaultCard);
  }

}
