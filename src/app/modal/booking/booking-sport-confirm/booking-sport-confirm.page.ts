import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { Booking } from '../../../shared/models/booking';
import { Playground } from '../../../shared/models/playground';
import { Club } from '../../../shared/models/club';
import { BookingService } from '../../../shared/services/booking/booking.service';
import { ModalController, Platform, ViewWillEnter } from '@ionic/angular';
import {filter, tap, last, switchMap, catchError, takeUntil} from 'rxjs/operators';
import { Activity } from '../../../shared/models/activity';
import { Cart } from '../../../shared/models/cart';
import { Wallet } from '../../../shared/models/wallet';
import { ClientClub } from '../../../shared/models/client-club';
import { StripeService } from '../../../shared/services/payment/stripe.service';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { ActivityService } from '../../../shared/services/activity/activity.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ManagePaymentService } from '../../../shared/services/payment/manage-payment.service';
import { PaymentCard } from 'src/app/shared/models/payment-card';
import { PaymentCardService } from 'src/app/shared/services/storage/payment-card.service';
import { of, EMPTY, Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AttenderBooking } from 'src/app/shared/models/attender-booking';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { Store } from '@ngrx/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { getCurrentClub } from 'src/app/club/store';
import { Browser } from "@capacitor/browser";
import { ManageMethodComponent } from 'src/app/components/payments/manage-method/manage-method.component';
import { HttpService } from 'src/app/shared/services/http.service';
import {getCurrentMe} from "../../../account/store";

@Component({
  selector: 'app-booking-sport-confirm',
  templateUrl: './booking-sport-confirm.page.html',
  styleUrls: ['./booking-sport-confirm.page.scss'],
  providers: [StripeService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingSportConfirmPage implements OnInit, OnDestroy, ViewWillEnter {
  @Input() wallet: Wallet;
  @Input() client: ClientClub;
  @Input() playground: Playground;
  @Input() activityId: string;
  @Input() booking: Booking;
  @Input() methods: Array<string>;
  @Input() price: any;
  @Input() slot: any;
  @ViewChild(ManageMethodComponent, {static: false}) manageMethodComponent: ManageMethodComponent = null;

  paymentLoading: boolean = false;
  instalmentPercentage: any;

  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  club: Club;
  /* TODO: add type for participant */
  activity: Activity;
  paymentCard: Array<PaymentCard>;
  skeletonClub: boolean;
  pathFiles: string;
  loadingBtn = false;
  selectedMethod: string;
  discountParticipantsCount = 0;
  defaultCard: any;
  card$: Observable<any>;
  restToPay = null;
  totalOption = 0;
  cart: Cart;
  withWallet = false;
  withCredit = false;
  paymentsProvider: Array<string>;
  selectedProvider: string;
  paymentMetadata: any;
  pendingOm: boolean;
  paymentHasBeenDroppedByUser: boolean;
  paymentWindowHasBeenClosed = false;
  browser: any;
  paymentHasFailed: boolean;
  cancellationCondition: string = undefined;
  priceDetailsList: Map<string, any> = new Map();
  priceTotalList: Map<string, any>;
  webStripeElementCompleted = false;
  participant: AttenderBooking;
  userMe: any;
  loader = true;

  constructor(
    private bookingService: BookingService,
    private paymentCardService: PaymentCardService,
    private modalCtr: ModalController,
    private activityService: ActivityService,
    private toastService: ToastService,
    private accountStore: Store<any>,
    private stripeService: StripeService,
    private managePaymentService: ManagePaymentService,
    private loaderService: LoaderService,
    private platform: Platform,
    private translate: TranslateService,
    private environmentService: EnvironmentService,
    private ref: ChangeDetectorRef,
    private clubStore: Store<ClubState>,
    private httpService: HttpService,
  ) {
    this.pathFiles = environmentService.getEnvFile().pathFiles;
    this.paymentsProvider = environmentService.getEnvFile().paymentsProvider;

    if (this.paymentsProvider.includes('stripe')) {
      this.stripeService.reloadStripeAccount();
      this.card$ = this.stripeService.card;
    }

    this.selectedProvider = this.paymentsProvider[0];
    this.selectedMethod = null;
    this.pendingOm = false;
  }

  async ngOnInit() {
    if (this.slot.prices[0].instalmentAmount) {
      this.instalmentPercentage = this.slot.prices[0].instalmentAmount;
    } else {
      if (this.slot.instalmentPercentage) {
        this.instalmentPercentage = this.slot.instalmentPercentage;
      }
    }
    this.skeletonClub = true;
    if (this.selectedMethod === null && this.methods.length > 0) {
      this.selectedMethod = this.methods[0];
    } else if (this.selectedMethod === null) {
      this.selectedMethod = 'on_the_spot';
    }
    this.clubStore.select(getCurrentClub).pipe(
        takeUntil(this.ngUnsubscribe),
        tap((club: any) => {
          this.club = club;
          this.accountStore.select(getCurrentMe).subscribe(
              async (resp) => {
                this.userMe = resp
                this.getActivityData();
                this.getPaymentMethod();
                this.getPaymentCards();
                this.initCreateBooking();
              }
          );
        })
    ).subscribe();
  }


  ionViewWillEnter() {
    if (this.selectedProvider === 'orange_money') {
      this.checkOm();
    }
  }

  checkOm() {
    if (this.paymentMetadata) {
      this.managePaymentService.checkOrangeMoney(this.paymentMetadata.orderId)
        .pipe(
          takeUntil(this.ngUnsubscribe),
        )
        .subscribe(res => {
          if (res) {
            switch (res.status) {
              case 'SUCCESS':
                setTimeout(_ => {
                  this.browser.close();
                  this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                    this.toastService.presentSuccess('orange_moment_payment_success', 'top');
                    this.loaderService.dismiss();
                  });
                }, 1500);
                break;
              case 'INITIATED':
                if (this.pendingOm && this.paymentWindowHasBeenClosed) {
                  this.modalCtr.dismiss({ booking: null, success: false }).then(() => {
                    this.paymentHasBeenDroppedByUser = true;
                    this.toastService.presentError('booking_payment_aborted', 'top');
                    this.loaderService.dismiss();
                  });
                } else if (this.pendingOm) {
                  setTimeout(_ => {
                    this.checkOm();
                  }, 1000);
                }
                break;
              case 'PENDING':
                setTimeout(_ => {
                  this.checkOm();
                }, 500);
                break;
              case 'FAILED':
                this.loaderService.dismiss();
                this.paymentHasFailed = true;
                break;
              default:
                setTimeout(_ => {
                  this.checkOm();
                }, 500);
                break;
            }
          } else {
            setTimeout(_ => {
              this.browser.close();
              this.modalCtr.dismiss({ booking: null, success: false }).then(() => {
                this.toastService.presentError('orange_moment_payment_failed', 'top');
                this.loaderService.dismiss();
              });
            }, 500);
          }
        });
    }
  }

  changeProvider(event) {
    this.selectedProvider = event;
    this.withWallet = this.selectedProvider === 'wallet';
  }

  updateSelectedCard(event) {
    this.defaultCard = event;

    if (this.paymentsProvider.includes('stripe')) {
      this.stripeService.setCard(this.defaultCard);
    }
  }

  getActivityData() {
    const iri = "/activities/" + this.activityId;
    this.activityService.get(iri).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(resp => {
      this.activity = resp;
    });
  }

  getPaymentMethod() {
    this.paymentCardService.getAllPaymentCards()
      .then((result: any) => {
        this.paymentCard = result;
      });
  }

  confirmBooking() {
    this.loaderService.presentLoading();
    if (this.booking.payments.length) {
      this.managePaymentService.sendPayments(this.booking.payments)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          last(),
          switchMap(resp => {
            if (resp !== undefined && resp) {
              const booking = this.serializeBooking();
              booking.confirmed = true;
              return this.bookingService.updateBooking(booking);
            } else {
              return EMPTY;
            }
          }),
          tap(response => {
            if (response) {
              this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                this.toastService.presentSuccess('toast_payment_success', 'top');
                this.loaderService.dismiss();
                if (this.environmentService.isThisMB('padelhorizon')) {
                  window.location.href = "https://www.padel-horizon.com/merci/";
                }
              });
            } else {
              console.error("ERROR: BOOKING NOT RECORDED");
            }
          }),
          catchError(error => of(console.error("SEND PAYMENTS ERROR: ", error)))
        )
        .subscribe();
    } else {
      const booking = this.serializeBooking();
      booking.confirmed = true;
      this.bookingService.updateBooking(booking)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(response => {
            if (response) {
              this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                this.toastService.presentSuccess('toast_payment_success', 'top');
                this.loaderService.dismiss();
                if (this.environmentService.isThisMB('padelhorizon')) {
                  window.location.href = "https://www.padel-horizon.com/merci/";
                }
              });
            }
          })
        )
        .subscribe();
    }

  }

  getDiff() {
    const diffMinutes = moment(this.booking.endAt).diff(moment(this.booking.startAt), 'minutes');
    if (diffMinutes < 60) {
      return diffMinutes + 'min';
    } else if ((parseInt('' + (diffMinutes / 60), null) * 60) === diffMinutes) {
      return (diffMinutes / 60) + 'h';
    } else {
      return parseInt('' + (diffMinutes / 60), null) + 'h' + (diffMinutes - (parseInt('' + (diffMinutes / 60), null) * 60));
    }
  }

  getDiffInMin() {
    return moment(this.booking.endAt).diff(moment(this.booking.startAt), 'minutes') + ' minutes';
  }

  getStartDateBasedOnClubLocale() {
    return (moment.utc(this.booking.startAt).tz(this.club.timezone, false).format('YYYY-MM-DD HH:mm:ss')).replace(/\s/g, "T");
  }

  changeMethod(event) {
    this.withWallet = false;
    this.selectedMethod = event;
    this.booking.paymentMethod = this.selectedMethod;
    if (this.booking.paymentMethod !== 'on_the_spot') {
      this.loadingBtn = true;
      const booking = this.serializeBooking();

      this.bookingService.updateBooking(booking)
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(data => {
          this.booking = data;
          this.calculateRestToPay();
          this.setPrice();
          this.setPriceDetails();
          this.ref.markForCheck();
          this.loadingBtn = false;
        });
    }
  }

  confirmPayments() {
    if(this.paymentLoading) {
      return;
    }
    if(this.withWallet && this.restToPay > 0) {
      return;
    }
    this.loaderService.presentLoading();
    this.paymentLoading = true;
      if (this.selectedProvider === 'epay') {
        if (this.manageMethodComponent) {
          this.managePaymentService.sendPayments(this.booking.payments)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              tap(() => {
                this.calculateRestToPay();
                this.setPrice();
                this.setPriceDetails();
              })
            )
            .subscribe((payment) => {
              this.manageMethodComponent.submitEpay(() =>
              this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                this.paymentLoading = false;
                this.loaderService.dismiss();
              }), () => {

                 this.httpService.baseHttp('get', `/payments/${payment.id}/refund`).pipe(
                  takeUntil(this.ngUnsubscribe),
                ).subscribe(() => {
                   this.paymentLoading = false;
                  this.loaderService.dismiss();
                  this.toastService.presentError('booking_payment_aborted', 'top');
                });
            });
        });
      }
      return;
    }

      let clientId = null;
      if (this.booking.payments.length) {
        this.managePaymentService.sendPayments(this.booking.payments)
          .pipe(
            takeUntil(this.ngUnsubscribe),
            last(),
            tap(() => {
              this.calculateRestToPay();
              this.setPrice();
              this.setPriceDetails();
            }),
            switchMap(() => {
              const booking = this.serializeBooking();
              if (this.client['@id']) {
                clientId = this.client['@id'];
              }
              if (this.selectedMethod === 'deposit') {
                return this.managePaymentService.createPaymentBooking(
                  booking,
                  this.cart,
                  this.selectedProvider,
                  'card',
                  this.club.currency,
                  this.restToPay,
                  clientId,
                  this.booking.userClient,
                  'manual'
                );
              } else {
                return this.managePaymentService.createPaymentBooking(
                  booking,
                  this.cart,
                  this.selectedProvider,
                  'card',
                  this.club.currency,
                  this.restToPay,
                  clientId,
                  this.booking.userClient
                );
              }
            }),
            filter(payment => payment !== undefined),
            tap(payment => {
              this.managePaymentResponse(payment, clientId);
            })
          )
          .subscribe();
      } else {
        this.calculateRestToPay();
        this.setPrice();
        this.setPriceDetails();
        const booking = this.serializeBooking();
        if (this.client['@id']) {
          clientId = this.client['@id'];
        }

        this.managePaymentService.createPaymentBooking(
          booking,
          this.cart,
          this.selectedProvider,
          'card',
          this.club.currency,
          this.restToPay,
          clientId,
          this.booking.userClient,
            (this.selectedMethod === 'deposit') ? 'manual' : null
        )
          .pipe(
            takeUntil(this.ngUnsubscribe),
            filter(payment => payment !== undefined),
            tap(payment => {
              this.managePaymentResponse(payment, clientId);
            })
          )
          .subscribe();
      }
  }

  managePaymentResponse(payment, clientId) {
    switch (payment.provider) {
      case 'stripe':
        this.stripeService.clientSecret = payment.metadata.clientSecret;
        if (this.platform.is("mobileweb") || this.platform.is("desktop")) {
          this.stripeService.confirmWebPayment()
              .then(res => {
                if (!res.paymentIntent) {
                  res = JSON.parse(res);
                }
                if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
                  this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                    // this.toastService.presentSuccess('payment_booking_succeeded');
                    this.loaderService.dismiss();
                    if (this.environmentService.isThisMB('padelhorizon')) {
                      window.location.href = "https://www.padel-horizon.com/merci/";
                    }
                  });
                }
              })
              .catch(error => {
                if (this.selectedMethod === 'deposit' && error.paymentIntent && error.paymentIntent.status === 'requires_capture') {
                  this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                    this.loaderService.dismiss();
                    if (this.environmentService.isThisMB('padelhorizon')) {
                      window.location.href = "https://www.padel-horizon.com/merci/";
                    }
                  });
                }
                this.loaderService.dismiss();
              });
        } else {
          this.stripeService.confirmPayment(this.defaultCard, this.club.stripeAccountReference, clientId)
              .then(res => {
                if (!res.paymentIntent) {
                  res = JSON.parse(res);
                }
                if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
                  this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                    // this.toastService.presentSuccess('payment_booking_succeeded');
                    this.loaderService.dismiss();
                  });
                }
              })
              .catch(error => {
                if (this.selectedMethod == 'deposit' && error.paymentIntent && error.paymentIntent.status === 'requires_capture') {
                  this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                    // this.toastService.presentSuccess('payment_booking_succeeded');
                    this.loaderService.dismiss();
                    if (this.environmentService.isThisMB('padelhorizon')) {
                      window.location.href = "https://www.padel-horizon.com/merci/";
                    }
                  });
                }
                this.loaderService.dismiss();
              });
        }
        break;
      case 'orange_money':
        if (payment.metadata.paymentUrl) {
          this.pendingOm = true;
          this.paymentMetadata = payment.metadata;
          if (this.platform.is("hybrid")) {
            // this.browser = this.iab.create(payment.metadata.paymentUrl, "_blank");
            this.browser = Browser.open(payment.metadata.paymentUrl).catch(e => {
              console.log('err : ', e);
            });
            this.paymentWindowHasBeenClosed = false;
            this.browser.addListener(
                'browserFinished', () => {
                  this.paymentWindowHasBeenClosed = true;
                  if (this.paymentHasFailed) {
                    this.modalCtr.dismiss({ booking: null, success: false }).then(() => {
                      this.toastService.presentError('orange_moment_payment_failed', 'top');
                      this.loaderService.dismiss();
                    });
                  }
                });
            setTimeout(_ => {
              this.checkOm();
            }, 1000);

          } else {
            window.open(payment.metadata.paymentUrl, 'blank');
            this.checkOm();
          }
        }
        break;
    }
  }

  getPayments(event) {
    this.booking.payments = event.booking.payments;

    this.calculateRestToPay();
    this.setPrice();
    this.setPriceDetails();
  }

  initCreateBooking() {
    const bookingDTO = { ...this.booking };

    // const clubId =  this.club.id

    bookingDTO.club = this.club["@id"];
    bookingDTO.playgrounds = [this.booking.playgrounds[0]['@id']];
    bookingDTO.participants.map((participant) => {
      participant.bookingOwner = (participant.user && participant.user === this.userMe['@id']) || (participant.client && String(participant.client) === this.client['@id']);
      participant.subscriptionCard = (participant.subscriptionCard) ? (participant.subscriptionCard['@id'] ? participant.subscriptionCard['@id'] : participant.subscriptionCard ) : undefined;
    });

    this.booking.paymentMethod = this.selectedMethod;
    bookingDTO.paymentMethod = this.selectedMethod;
    this.bookingService.createBooking(bookingDTO, this.club.timezone)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(booking => {
          if (booking) {
            this.booking = booking;
            this.participant = this.booking.participants.find(p => p['addedBy'] === null);

            if (!this.client) {
              this.client = this.participant.client;
            }
            this.calculateRestToPay();
            this.setCancellationCondition();
            this.setPrice();
            this.setPriceDetails();
          } else {
            this.back();
          }
        }),
        switchMap(booking => {
          if (booking) {
            return this.managePaymentService.createCart({
              items: [{
                product: this.booking['@id'],
                price: this.restToPay
              }]
            });
          } else {
            return of(null);
          }
        }),
        tap((cart: any) => {
          if (cart) {
            this.cart = cart;
          }
          this.skeletonClub = false;
          this.ref.markForCheck();
        })
      )
      .subscribe(() => {
        this.loader = false;
      });
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
    this.setPrice();
    this.setPriceDetails();
  }

  getPaymentCards() {
    this.paymentCardService.getDefaultPaymentCard()
      .then(cardsString => {
        this.defaultCard = null;
        const arrayData = JSON.parse(cardsString.value);
        if (arrayData) {
          arrayData.forEach(item => {
            if (item.default) {
              this.defaultCard = item;
            }
          });
        }
      });
  }

  back() {
    this.modalCtr.dismiss({ booking: this.booking, success: false }).then(() => { });
  }

  calculateRestToPay() {
    let amount = 0;
    switch (this.selectedMethod) {
      case 'instalment':
        if (this.slot.prices[0].instalmentAmount) {
          amount = this.instalmentPercentage;
        } else {
          if (this.slot.instalmentPercentage) {
            amount = parseInt('' + (this.booking.price * (this.slot.instalmentPercentage / 100)));
          }
        }
        this.restToPay = amount;
        break;
      case 'per_participant':
        this.booking.participants.forEach(participant => {
           if (participant.user && participant.user && participant.user['@id'] === this.booking.userClient['@id']) {
            amount = participant.restToPay;
          }
        });
        break;
      default:
        amount = this.booking.price;
        break;
    }
    if (this.booking.payments !== undefined) {
      this.booking.payments.forEach(payment => {
          amount = amount - payment.amount;
      });
    }

    this.restToPay = amount < 0 ? 0 : amount;
  }

  isDisabled() {
    let result = true;
    if (!this.platform.is('desktop') && !this.platform.is('mobileweb')) { // case App pp use
      result = (
          !this.withCredit && !this.withWallet && (  this.defaultCard === undefined || this.defaultCard == null)
        ) &&
        !(this.selectedProvider === 'orange_money');
    } else { // case Web use
      result = (!this.withCredit && !this.withWallet) && !(this.selectedProvider === 'orange_money') && !this.webStripeElementCompleted;
    }
    return result;
  }

  serializeBooking() {
    if (!this.booking) {
      return null;
    }
    const serializedBooking = {...this.booking};
    serializedBooking.activity = this.booking.activity['@id'];
    serializedBooking.club = this.booking.club['@id'];
    serializedBooking.userClient = this.booking.userClient['@id'];
    const playgrounds = [];
    this.booking.playgrounds.forEach(playground => {
      playgrounds.push(playground['@id']);
    });
    serializedBooking.playgrounds = playgrounds;
    serializedBooking.playgroundOptions = this.booking.playgroundOptions;

    const participants = [];
    this.booking.participants.forEach(participant => {
      if (participant) {
        participants.push(participant['@id']);
      } else {
        participants.push({
          user: participant.user['@id'],
          subscriptionCard: participant.subscriptionCard
        });
      }
    });
    serializedBooking.participants = participants;
    serializedBooking.playgroundOptions.forEach(option => {

      option['id'] = option['@id'];
      option['quantity'] = option['option']['quantity'];
      delete option['@id'];
      delete option['@type'];
      delete option['participant'];
      delete option['label'];
      delete option['option'];
    });

    serializedBooking.timetableBlockPrice = serializedBooking.timetableBlockPrice['@id'] ?
        serializedBooking.timetableBlockPrice['@id'] :
        serializedBooking.timetableBlockPrice;

    return serializedBooking;
  }

  setCancellationCondition() {
    switch (this.playground.bookingCancellationConditionType) {
      case "custom":
        this.cancellationCondition = this.translate.instant('booking_cancellation_condition_custom',
          { hours: this.hhmmss(this.playground.bookingCancellationConditionCustomHours) });
        break;
      case "strict":
        this.cancellationCondition = this.translate.instant('booking_cancellation_condition_strict');
        break;
      case "soft":
        this.cancellationCondition = this.translate.instant('booking_cancellation_condition_soft');
        break;
      default:
        this.cancellationCondition = undefined;
    }
  }

  hhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${this.pad(hours) !== '00' ? this.pad(hours) + 'h' : ''} ${this.pad(minutes) !== '00' ? this.pad(minutes) + 'min' : ''} ${this.pad(secs) !== '00' ? this.pad(secs) + 'sec' : ''}`;
  }

  pad(num) {
    return ("0" + num).slice(-2);
  }

  setPriceDetails() {
    this.priceDetailsList = new Map();
    this.discountParticipantsCount = 0;
    // let restToPay = 0;
    this.priceDetailsList.set('normal', { count: 0, label: "", price: 0 });
    this.booking.participants
      .filter(participant => participant.canceled === false)
      .map(participant => {
        if (participant.subscriptionCard) {
          this.discountParticipantsCount++;
          if (this.priceDetailsList.get(participant.subscriptionCard['plan']['id'])) {
            this.priceDetailsList.set(participant.subscriptionCard['plan']['id'],
              {
                count: this.priceDetailsList.get(participant.subscriptionCard['plan']['id']).count + 1,
                label: '(' + participant.subscriptionCard['name'] + ')',
                price: (participant.price * (this.priceDetailsList.get(participant.subscriptionCard['plan']['id']).count + 1))
              });
          } else {
            let subCardName = '';
            if (participant.subscriptionCard['name']) {
              subCardName = '(' + participant.subscriptionCard['name'] + ')';
            }
            this.priceDetailsList.set(
              participant.subscriptionCard['plan']['id'],
              {
                count: 1,
                label: subCardName,
                price: participant.price
              }
            );
          }
        } 
        // else {
        //   restToPay = participant.restToPay;
        // }
      });
    this.priceDetailsList.set('normal',
      {
        count: this.booking.maxParticipantsCountLimit - this.discountParticipantsCount,
        label: "", price: this.booking.pricePerParticipant * (this.booking.maxParticipantsCountLimit - this.discountParticipantsCount)
      });
    this.booking.playgroundOptions.forEach(option => {
      const quantity = option.quantity ? option.quantity : 1;
      this.priceDetailsList.set(option['@id'], {
        count: quantity,
        label: option.option['label'],
        price: option.option['price'] * quantity
      });
    });
  }

  setPrice() {
    this.priceTotalList = new Map();
    // pas le prix du restToPay mais le prix du user.
    this.totalOption = 0;
    if (this.booking.paymentMethod === 'per_participant') {
      const part = this.booking.participants.filter(participant => participant.client.id === this.client.id);
      const myRestToPay = (part.length > 0) ? this.booking.participants.filter(participant => participant.client.id === this.client.id)[0]['price']
        : this.restToPay;
      this.priceTotalList.set('normal', { count: 1, label: 'Participant', price: myRestToPay });
      this.booking.playgroundOptions.forEach(option => {
        const quantity = option.quantity ? option.quantity : 1;
        this.priceTotalList.set(option['@id'], {
          count: quantity,
          label: option.option['label'],
          price: option.option['price'] * quantity
        });
        this.totalOption += option.option['price'] * quantity;
      });
      this.restToPay += this.totalOption;
    } else if (this.booking.paymentMethod === 'instalment') {

    }
    this.booking.payments.map(paiment => {
      if (paiment.metadata && paiment.metadata.paymentTokenValue) {
        this.priceTotalList.set(paiment.userClient['@id'],
          {
            count: paiment.metadata.paymentTokenValue,
            label: paiment.name,
            price: '-' + paiment.amount
          });
      } else if (paiment.provider === "wallet") {
        this.priceTotalList.set(paiment.userClient['@id'] + 'wallet',
          {
            count: 1,
            label: 'Wallet',
            price: '-' + (paiment.amount)
          });
      }
    });

    this.booking.restToPay = this.restToPay;
  }

  triggerPaymentData(result) {
    this.webStripeElementCompleted = result;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
