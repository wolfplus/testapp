import {Component, Input, OnInit} from '@angular/core';
import {ModalController, Platform} from "@ionic/angular";
import {Booking} from "../../shared/models/booking";
import {Cart} from "../../shared/models/cart";
import {Observable, of} from "rxjs";
import {StripeService} from "../../shared/services/payment/stripe.service";
import {PaymentCardService} from "../../shared/services/storage/payment-card.service";
import {BookingService} from "../../shared/services/booking/booking.service";
import {ManagePaymentService} from "../../shared/services/payment/manage-payment.service";
import {filter, last, map, switchMap, tap} from "rxjs/operators";
import {EnvironmentService} from "../../shared/services/environment/environment.service";
import {LoaderService} from "../../shared/services/loader/loader.service";
import {ToastService} from "../../shared/services/toast.service";
import * as moment from 'moment';
import {PriceCalculatorService} from "../../shared/services/price/price-calculator.service";
import {getCurrentMe} from "../../account/store";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-booking-group-payment',
  templateUrl: './booking-group-payment.component.html',
  styleUrls: ['./booking-group-payment.component.scss']
})
export class BookingGroupPaymentComponent implements OnInit {

  @Input() prestation: any;
  @Input() playgroundOptions: any;
  @Input() customData: any;
  @Input() options: any;
  @Input() club: any;
  @Input() date: any;
  @Input() slot: any;
  @Input() categories: any;
  @Input() countParticipant: any;
  @Input() blockPrice: any;
  @Input() playground: any;
  @Input() formulaParticipant: number = 0;
  instalmentPercentage: any;
  dataParticipants: Array<any> = [];
  isLoading: boolean = false;
  price: string;
  userPrice: any;
  showPaymentManage = false;
  participants: any[] = [];
  methods: Array<string>;
  selectedMethod: string;
  paymentsProvider: Array<string>;
  selectedProvider: string;
  booking: any;
  cart: Cart;
  client: any;
  user: any;
  wallet: any;
  restToPayCart: any;
  restToPay: any;
  defaultCard: any;
  amountToPay;
  paymentCard: any;
  card$: Observable<any>;
  webStripeElementCompleted = false;
  env: any;
  participant: any;

  constructor(
      private modalCtrl: ModalController,
      private paymentCardService: PaymentCardService,
      private stripeService: StripeService,
      private bookingService: BookingService,
      private managePaymentService: ManagePaymentService,
      private environmentService: EnvironmentService,
      private loaderService: LoaderService,
      private modalCtr: ModalController,
      private platform: Platform,
      private toastService: ToastService,
      private accountStore: Store<any>,
      private priceCalculator: PriceCalculatorService
  ) {
    this.stripeService.reloadStripeAccount();
    this.selectedMethod = null;
    this.env = environmentService.getEnvFile();
    this.paymentsProvider = environmentService.getEnvFile().paymentsProvider;
    this.selectedProvider = this.paymentsProvider[0];
    this.card$ = this.stripeService.card;
    this.booking = {
      payments: [],
    };
  }

  ngOnInit(): void {
    if (this.prestation.instalmentAmount) {
      this.instalmentPercentage = this.prestation.instalmentAmount;
    } else {
      if (this.slot.instalmentPercentage) {
        this.instalmentPercentage = this.slot.instalmentPercentage;
      }
    }
    this.stripeService.reloadStripeAccount();
    this.methods = this.slot.paymentMethods;
    // DELETE PAYMENT PER PARTICIPANT IF EXIST
    const index = this.methods.indexOf('per_participant');
    if (index > -1) {
      this.methods.splice(index, 1);
    }
    if (this.selectedMethod === null && this.methods.length > 0) {
      this.selectedMethod = this.methods[0];
    } else if (this.selectedMethod === null) {
      this.selectedMethod = 'on_the_spot';
    }

    this.accountStore.select(getCurrentMe).pipe(
        switchMap((data: any) => {
          this.user = data;
          let clients = null;
          if (data.clients) {
            clients = data.clients;
          }
          console.log(this.user, clients, "allelr okokok <===")

          if (clients) {
            if (clients[0]) {
              const client = clients[0];
              this.client = client;
              this.wallet = client.wallet;
              return this.priceCalculator.getPriceVariations(this.blockPrice.id);
            } else {
              this.loaderService.dismiss();
              return of(null);
            }
          } else {
            this.loaderService.dismiss();
            return of(null);
          }
        }),
        tap(prices => {
          if (prices) {
            this.userPrice = this.priceCalculator.getClientPrice(this.blockPrice, prices, this.client, this.club.id);
            if (this.client.subscriptionCardsAvailable) {
              this.userPrice.subscriptionCard = this.client.subscriptionCardsAvailable.find(subCard =>
                  subCard['@id'] === this.userPrice.subscriptionCard
              );
            } else {
              this.userPrice.subscriptionCard = null;
            }
          }
          this.initBooking();
        })
    ).subscribe();
    this.getPaymentCards();
  }

  getDetailParticipants() {
    this.dataParticipants = [];
    const data = [];
    this.categories.forEach(item => {
      for (let i = 0; i < item.count; i++) {
        if (item.isOwner) {
          if (i === 0) {
            data[item.category["@id"] + "_" + item.priceOwner] = {
              count: 1,
              label: item.category.label,
              subscriptionCard: item.subscriptionCard ? item.subscriptionCard: null,
              price: item.priceOwner
            }
          } else {
            data[item.category["@id"] + "_" + item.pricePerParticipant] = {
              count: (data[item.category["@id"] + "_" + item.pricePerParticipant] ? data[item.category["@id"] + "_" + item.pricePerParticipant].count : 0) + 1,
              label: item.category.label,
              subscriptionCard: item.subscriptionCard ? item.subscriptionCard: null,
              price: item.pricePerParticipant
            }
          }
        } else {
          data[item.category["@id"] + "_" + item.pricePerParticipant] = {
            count: (data[item.category["@id"] + "_" + item.pricePerParticipant] ? data[item.category["@id"] + "_" + item.pricePerParticipant].count : 0) + 1,
            label: item.category.label,
            price: item.pricePerParticipant
          }
        }
      }
    });
    for (let key of Object.keys(data)) {
      let cat = data[key];
      this.dataParticipants.push(cat);
    }
  }

  updateSelectedCard(event) {
    this.defaultCard = event;
    this.stripeService.setCard(this.defaultCard);
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
  close() {
    this.modalCtrl.dismiss({success: false, status: 'back'}, '', 'modal-booking-payment').then();
  }

  totalToPay() {
    let amount = 0;
    this.categories.forEach(item => {
      if (this.countParticipant.get(item.category['@id'])) {
        amount = amount + (this.countParticipant.get(item.category['@id']) * item.pricePerParticipant);
      }
    });

    return amount;
  }

  initBooking() {
    const participantsInit = [];
    this.categories.forEach(item => {
      let ownerAdded = false;
      for (let i = 0; i < item.count; i++) {
        if (item.isOwner && !ownerAdded) {
          ownerAdded = true;
          participantsInit.push({
            category: item.category['@id'],
            user: this.user['@id'],
            subscriptionCard: this.userPrice ? (this.userPrice.subscriptionCard ? this.userPrice.subscriptionCard['@id'] : null) : null,
          });
          if (this.userPrice && this.userPrice.subscriptionCard) {
            item.priceOwner = this.userPrice.price;
            item.subscriptionCardOwner = this.userPrice.subscriptionCard;
          } else {
            item.priceOwner = item.pricePerParticipant;
          }
        } else {
          participantsInit.push({category: item.category['@id']});
        }
      }
    });

    if (this.categories.length === 0 && this.prestation.activityType === 'formula') {
      if (this.formulaParticipant > 1) {
        participantsInit.push({user: this.user['@id'], accompanyingParticipantsCount: (this.formulaParticipant - 1)});
        for (let i = 1; i < this.formulaParticipant; i++) {
          participantsInit.push({addedBy: this.user['@id']});
        }
      } else if (this.formulaParticipant === 1) {
        participantsInit.push({user: this.user['@id'], accompanyingParticipantsCount: (this.formulaParticipant - 1)});
      }
    }

    const startAt = moment(this.date.format('YYYY-MM-DD') + " " + this.slot.startAt).tz(this.club.timezone, true);
    const endAt = startAt.clone();
    endAt.add(this.prestation.duration, 'seconds');

    const bookingDTO: Booking = {
      customData: this.customData,
      playgroundOptions: this.playgroundOptions,
      activity: this.prestation.activity['@id'],
      club: this.club['@id'],
      playgrounds: [this.playground['@id']],
      timetableBlockPrice: this.blockPrice['@id'],
      startAt: startAt.utc().format('YYYY-MM-DD HH:mm:ss'),
      maxParticipantsCountLimit: this.prestation.maxParticipantsCountLimit,
      endAt: endAt.utc().format('YYYY-MM-DD HH:mm:ss'),
      userClient: this.user['@id'],
      canceled: false,
      creationOrigin: 'white_label_app',
      name: this.user.firstName + ' ' + this.user.lastName,
      paymentMethod: this.selectedMethod,
      participants: participantsInit
    };

    this.bookingService.createBooking(bookingDTO).pipe(
        switchMap(responseBooking => {
          if (responseBooking) {
            this.booking = responseBooking;
            this.booking.participants = participantsInit;
            this.participants = this.booking.participants;

            this.bookingService.getBookingParticipantsFull(this.booking.id).pipe(tap(dataParticipants => {
              this.booking.participants = dataParticipants['hydra:member'];
              this.participants = dataParticipants['hydra:member'];
              this.ownerParticipant();

            })).subscribe();


            const itemsCart = [];
            itemsCart.push({
              price: this.booking.price,
              product: this.booking['@id']
            });
            this.restToPay = this.booking.restToPay;
            this.restToPayCart = this.booking.restToPay;

            this.calculateRestToPay();

            return  of(itemsCart);
          } else {
            this.close();
            return of(null);
          }
        }),
        switchMap(items => {
          if (items) {
            return this.managePaymentService.createCart({items});
          }
          return of(null);
        }),
        tap((cart: any) => {
          if (cart) {
            this.cart = cart;
          }

          this.getDetailParticipants();
          this.loaderService.dismiss().then();
          this.showPaymentManage = true;
        })
    ).subscribe();
  }

  confirmBooking() {
    this.bookingService.updateBooking({id: this.booking.id, confirmed: true})
        .pipe(
            tap(response => {
              if (response) {
                this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                  this.toastService.presentSuccess('toast_payment_success', 'top');
                  this.loaderService.dismiss();
                });
              }
            })
        )
        .subscribe();
  }

  confirmPayments() {

    if(this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.loaderService.presentLoading();
    let paymentsSent = 0;
    let clientId = null;
    clientId = this.client['@id'];
    if (this.selectedMethod === 'deposit') {
      this.managePaymentService.createPaymentBooking(
          this.booking,
          this.cart,
          this.selectedProvider,
          'card',
          this.club.currency,
          this.restToPay,
          clientId,
          this.booking.userClient,
          'manual'
      )
          .pipe(
              filter(payment => payment !== undefined),
              tap(payment => {
                this.managePaymentResponse(payment, clientId);
              })
          )
          .subscribe();
    } else {
      if(this.booking.payments.length) {
        console.log("ça passe par là jesper ?")
        this.managePaymentService.sendPayments(this.booking.payments, clientId)
            .pipe(
                tap(resp => {
                  if (resp && resp.status === 'succeeded') {
                    paymentsSent += 1;
                  }
                }),
                last(),
                map(resp => {
                  if (resp) {
                    if (paymentsSent === this.booking.payments.length) {
                      this.calculateRestToPay();
                      return resp;
                    } else {
                      resp.status = 'error';
                      return resp;
                    }
                  }
                })
            )
            .subscribe((paymentData) => {
              this.isLoading = false;
              if (this.selectedMethod === 'deposit' && this.restToPay > 0 && paymentData.status === 'succeeded') {
                this.managePaymentService.createPaymentBooking(
                    this.booking,
                    this.cart,
                    this.selectedProvider,
                    'card',
                    this.club.currency,
                    this.restToPay,
                    clientId,
                    this.booking.userClient,
                    'manual'
                ).pipe(
                    filter(payment => payment !== undefined),
                    tap(payment => {
                      this.managePaymentResponse(payment, clientId);
                    })
                )
                    .subscribe();
              } else if (this.restToPay > 0 && paymentData.status === 'succeeded'){
                this.managePaymentService.createPaymentBooking(
                    this.booking,
                    this.cart,
                    this.selectedProvider,
                    'card',
                    this.club.currency,
                    this.restToPay,
                    clientId,
                    this.booking.userClient
                ).pipe(
                    filter(payment => payment !== undefined),
                    tap(payment => {
                      this.managePaymentResponse(payment, clientId);
                    })
                )
                    .subscribe();
              } else {
                this.managePaymentResponse(paymentData, clientId);
              }
            });
      } else {
        this.managePaymentService.createPaymentBooking(
            this.booking,
            this.cart,
            this.selectedProvider,
            'card',
            this.club.currency,
            this.restToPay,
            clientId,
            this.booking.userClient
        ).pipe(
            filter(payment => payment !== undefined),
            tap(payment => {
              this.managePaymentResponse(payment, clientId);
            })
        )
            .subscribe();
      }
    }
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

  getPayments(event) {
    this.booking = event.booking;
    this.calculateRestToPay();
  }

  calculateRestToPay() {

    let amount;
    switch (this.selectedMethod) {
      case 'instalment':
        if (this.prestation.instalmentAmount) {
          amount = this.instalmentPercentage;
        } else {
          if (this.slot.instalmentPercentage) {
            amount = parseInt('' + (this.booking.price * (this.slot.instalmentPercentage / 100)));
          }
        }

        if (this.booking.payments !== undefined) {
          this.booking.payments.forEach(payment => {
            amount = amount - payment.amount;
          });
        }
        this.restToPay = amount;
        break;
      case 'complete':
        amount = this.restToPayCart;
        if (this.booking.payments !== undefined) {
          this.booking.payments.forEach(payment => {
            amount = amount - payment.amount;
          });
        }
        this.restToPay = amount;
        break;
      case 'per_participant':
        amount = this.restToPayCart;
        if (this.booking.payments !== undefined) {
          this.booking.payments.forEach(payment => {
            amount = amount - payment.amount;
          });
        }
        this.restToPay = amount;
        break;
      default:
        amount = this.booking.restToPay;
        break;
    }

    this.restToPay = amount < 0 ? 0 : amount;

    if (this.restToPay > 0 && this.selectedMethod !== 'on_the_spot') {
      this.webStripeElementCompleted = false;
    } else if (this.selectedMethod === 'on_the_spot') {
      this.webStripeElementCompleted = true;
    } else if (this.restToPay <= 0) {
      this.webStripeElementCompleted = true;
    }
  }

  changeProvider(event) {
    this.selectedProvider = event;
  }

  triggerPaymentData(result) {
    this.webStripeElementCompleted = result;
  }

  ownerParticipant() {
    this.participants.forEach(item => {
      if (item.user) {
        if (item.user['@id'] === this.user['@id']) {
          this.participant = item;
          this.participant.client = this.client;
          this.participant.user = this.user;
        }
      }
    });
  }

  changeMethod(event) {
    this.loaderService.presentLoading();
    this.selectedMethod = event;
    this.booking.paymentMethod = event;
    if (this.selectedMethod === 'on_the_spot') {
      this.webStripeElementCompleted = true;
      this.calculateRestToPay();
      this.loaderService.dismiss();
    }  else {
      this.webStripeElementCompleted = false;
      this.bookingService.putDataBooking(this.booking['@id'], {paymentMethod: event}).pipe(tap(booking => {
        this.booking = booking;
        this.calculateRestToPay();
        this.loaderService.dismiss();
      })).subscribe();
    }
  }

  managePaymentResponse(payment, clientId) {
    switch (payment.provider) {
      case 'stripe':
        this.stripeService.clientSecret = payment.metadata.clientSecret;
        if (!this.platform.is("android") && !this.platform.is("ios")) {
          this.stripeService.confirmWebPayment()
              .then(res => {
                if (!res.paymentIntent) {
                  res = JSON.parse(res);
                }
                if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
                  this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                    this.toastService.presentSuccess('payment_booking_succeeded');
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
                    this.toastService.presentSuccess('payment_booking_succeeded');
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
                    this.toastService.presentSuccess('payment_booking_succeeded');
                    this.loaderService.dismiss();
                  });
                }
              })
              .catch(error => {
                if (this.selectedMethod === 'deposit' && error.paymentIntent && error.paymentIntent.status === 'requires_capture') {
                  this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
                    this.toastService.presentSuccess('payment_booking_succeeded');
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
      case 'payment_token':
      case 'wallet':
        if (payment.status === 'succeeded') {
          this.modalCtr.dismiss({ booking: this.booking, success: true }).then(() => {
            this.toastService.presentSuccess('payment_booking_succeeded');
            this.loaderService.dismiss();
          });
        } else {
          this.modalCtr.dismiss({ booking: this.booking, success: false }).then(() => {
            this.toastService.presentError('an_error_has_occured');
            this.loaderService.dismiss();
          });
        }
        break;
      case 'orange_money':
        // if (payment.metadata.paymentUrl) {
        //   this.pendingOm = true;
        //   this.paymentMetadata = payment.metadata;
        //   if (this.platform.is("hybrid")) {
        //     // this.browser = this.iab.create(payment.metadata.paymentUrl, "_blank");
        //     this.browser = Browser.open(payment.metadata.paymentUrl).then(b => {
        //     }).catch(e => {
        //       console.log('err : ', e);
        //     });
        //     // this.browser.show();
        //     this.paymentWindowHasBeenClosed = false;
        //     /*this.browser.on('loadstop')
        //       .subscribe();*/
        //
        //     this.browser.addListener(
        //         'browserFinished', () => {
        //           this.paymentWindowHasBeenClosed = true;
        //           if (this.paymentHasFailed) {
        //             this.modalCtr.dismiss({ booking: null, success: false }).then(() => {
        //               this.toastService.presentError('orange_moment_payment_failed', 'top');
        //               this.loaderService.dismiss();
        //             });
        //           }
        //         });
        //
        //     /*this.browser.on('exit')
        //       .pipe(
        //         tap(event => {
        //           this.paymentWindowHasBeenClosed = true;
        //           if (this.paymentHasFailed) {
        //             this.modalCtr.dismiss({ booking: null, success: false }).then(() => {
        //               this.toastService.presentError('orange_moment_payment_failed', 'top');
        //               this.loaderService.dismiss();
        //             });
        //           }
        //         })
        //       )
        //       .subscribe();*/
        //
        //     setTimeout(_ => {
        //       // this.checkOm();
        //     }, 1000);
        //
        //   } else {
        //     window.open(payment.metadata.paymentUrl, 'blank');
        //     // this.checkOm();
        //   }
        // }
        break;
    }
  }
}

