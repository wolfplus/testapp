import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Wallet } from '../../../shared/models/wallet';
import { Club } from '../../../shared/models/club';
import { Booking } from '../../../shared/models/booking';
import { Payment } from '../../../shared/models/payment';
import { AttenderBooking } from '../../../shared/models/attender-booking';
import { Cart } from '../../../shared/models/cart';
import { AccountService } from '../../../shared/services/account/account.service';
import { ClientClub } from '../../../shared/models/client-club';
import { ModalController, Platform } from '@ionic/angular';
import { CreditComponent } from '../credit/credit.component';
import { WalletComponent } from '../wallet/wallet.component';
import { CardComponent } from '../card/card.component';
import { map, takeUntil, tap } from 'rxjs/operators';
import { CreditClient } from 'src/app/shared/models/credit-client';
import { PaymentCardService } from 'src/app/shared/services/storage/payment-card.service';
import { PaymentCard } from 'src/app/shared/models/payment-card';
import { UserClient } from 'src/app/shared/models/user-client';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import {PriceCalculatorService} from "../../../shared/services/price/price-calculator.service";
import * as moment from 'moment';
import { EPayComponent } from '../e-pay/e-pay.component';
import { Subject } from 'rxjs';
import {getCurrentMe} from "../../../account/store";

@Component({
  selector: 'app-manage-method',
  templateUrl: './manage-method.component.html',
  styleUrls: ['./manage-method.component.scss']
})
export class ManageMethodComponent implements OnInit, OnDestroy {
  @Input() client: ClientClub;
  @Input() from: string;
  @Input() club: Club;
  @Input() discountParticipantsCount: number
  @Input() methods: Array<string>;
  @Input() booking: Booking;
  // @Input() payments: Array<Payment>;
  @Input() participant: AttenderBooking = undefined;
  // @Input() user: User;
  // @Input() prices: any;
  @Input() price: any;
  @Input() restToPay: number;
  @Input() totalOption: number;
  @Input() cart: Cart;
  @Output() triggerPaymentData = new EventEmitter<any>();
  @Output() backPayments = new EventEmitter();
  @Output() changeMethod = new EventEmitter();
  @Output() changeProviderBack = new EventEmitter();
  @Output() creditCardSelected = new EventEmitter();

  @ViewChild(EPayComponent, {static: false}) epay: EPayComponent = null;

  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  public PAYMENT_METHOD_COMPLETE = 'complete';
  public PAYMENT_METHOD_PER_PARTICIPANT = 'per_participant';
  public PAYMENT_METHOD_DEPOSIT = 'deposit';
  public PAYMENT_METHOD_ON_THE_SPOT = 'on_the_spot';
  public PAYMENT_METHOD_ACOMPTE = 'instalment';

  user: UserClient;
  instalmentPrice: any;
  userMe: any;
  paymentsProvider: Array<string>;
  withCredit = false;
  withWallet = false;
  wallet: Wallet;
  cards: Array<PaymentCard>;
  credits: Array<CreditClient>;
  showPaymentMethod = true;
  paymentTokensOpen: any;
  selectedProvider: string;
  selectedMethod: string = this.PAYMENT_METHOD_COMPLETE;
  bottomModal: any;
  selectedCreditCard: any = undefined;
  isCardSelected = false;
  defaultCard: PaymentCard;
  realResToPay = 0;

  constructor(
      private modalCtr: ModalController,
      private paymentCardService: PaymentCardService,
      private accountService: AccountService,
      private store: Store<AppState>,
      public platform: Platform,
      private accountStore: Store<any>,

      private priceCalculatorService: PriceCalculatorService,
      private environmentService: EnvironmentService
  ) {
    this.methods = [];
    this.credits = [];
    this.cards = [];
    this.paymentsProvider = this.environmentService.getEnvFile().paymentsProvider;
    this.selectedProvider = this.paymentsProvider[0];
    console.log(this.paymentsProvider, "<====");
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.getAllCards().then(() => {
      this.changeProvider(this.paymentsProvider[0]);
      this.store.select("user")
          .pipe(
              takeUntil(this.ngUnsubscribe),
              tap(async user => {
                if (user !== undefined) {
                  this.user = user;
                  await this.accountStore.select(getCurrentMe).pipe(tap(data => {
                    this.userMe = data;
                  })).subscribe();
                }
              })
          )
          .subscribe();
      if (this.methods.length > 0) {
        this.selectedMethod = this.methods[0];
      }
      if (this.client) {
        if (this.price) {
          if (typeof this.price ===  'string') {
            this.priceCalculatorService.getTimetablesBlocksPrice(this.price).pipe(
                takeUntil(this.ngUnsubscribe),
            ).subscribe(data => {
              this.price = data;
              if (data.paymentTokenPrices) {
                this.paymentTokensOpen = data.paymentTokenPrices;
              }

              if (this.client.subscriptionCardsAvailable) {
                this.client.subscriptionCardsAvailable.forEach(subscriptionCard => {
                  if ((this.booking && moment.utc(subscriptionCard.endDate) > moment(this.booking.endAt) && moment.utc(subscriptionCard.startDate) < moment(this.booking.startAt)) || !this.booking) {
                    data.variations.forEach(variation => {
                      if (variation.subscriptionPlan.id === subscriptionCard.subscriptionPlan.id) {
                        this.paymentTokensOpen = variation.paymentTokenPrices;
                      } // else if no match this.paymentTokensOpen = ?
                    });
                  }
                });
              } // else this.paymentTokensOpen = ?
            });
          } else if (typeof this.price === 'number') {

          } else {
            if (this.price.paymentTokenPrices) {
              this.paymentTokensOpen = this.price.paymentTokenPrices;
            }
            if (this.client.subscriptionCardsAvailable) {
              this.client.subscriptionCardsAvailable.forEach(subscriptionCard => {
                if ((this.booking && moment.utc(subscriptionCard.endDate) > moment(this.booking.endAt) && moment.utc(subscriptionCard.startDate) < moment(this.booking.startAt)) || !this.booking) {
                  this.price.variations?.forEach(variation => {
                    if (variation.subscriptionPlan.id === subscriptionCard.subscriptionPlan.id) {
                      this.paymentTokensOpen = variation.paymentTokenPrices;
                    } // else if no match this.paymentTokensOpen = ?
                  });
                }
              });
            }
          }
        }
        if (this.client.wallet) {
          this.wallet = this.client.wallet;
        } else {
          this.accountService.getWallets().subscribe(wallets => {
            wallets['hydra:member'].map(wallet => {
              if (wallet.club['@id'] === this.club['@id']) {
                this.wallet = wallet;
              }
            });
          });
        }
      }
      this.getUserClientCredits();
      this.realResToPay = this.booking.restToPay;
      this.calculateRestToPay();
    });
  }

  submitEpay(onSubmit: (response: KRPaymentResponse) => void, onError?: () => void) {
    if (this.epay) {
      this.epay.submit(onSubmit, onError);
    }
  }

  changeProvider(event) {
    this.selectedProvider = event;
    this.changeProviderBack.emit(event);
  }

  changeSelectedMethod() {
    this.withCredit = false;
    this.withWallet = false;
    this.selectedProvider = this.paymentsProvider[0];
    this.changeMethod.emit(this.selectedMethod);
  }

  getUserClientCredits() {
    if (!this.client) {
      this.credits = [];
      return;
    }
    this.accountService.getClientCredits(this.client.id)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          map(data => {
            if (data !== undefined) {
              this.credits = data['hydra:member'];
            } else {
              this.credits = [];
            }
          })
        )
        .subscribe();
  }

  getAllCards() {
    return this.paymentCardService.getAllPaymentCards()
        .then(data => {
          if (data) {
            this.cards = data;
            this.selectedCreditCard = this.cards.find(card => card.default === true);
            if(this.selectedCreditCard) {
              this.isCardSelected = true;
            }
            console.log(this.cards, this.selectedCreditCard, "============== SELECTED =============")
            if (!this.platform.is("mobileweb") && ! this.platform.is("desktop")) {
              this.triggerPaymentData.emit(true);
              this.creditCardSelected.emit(this.selectedCreditCard);
            }
          }
        });
  }
  presentCreditModal() {
    return this.modalCtr.create({
      id: 'modal-consume-credit',
      component: CreditComponent,
      componentProps: {
        client: this.client,
        club: this.club,
        paymentTokensOpen: this.paymentTokensOpen,
        credits: this.credits
      },
      cssClass: ['bottom-modal-class', 'pay-modal-css'],
      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      mode: 'ios'
    })
        .then(mod => {
          mod.present().then();
          return mod.onDidDismiss().then(data => {
            if(!data.data) {
              this.changeProvider(this.paymentsProvider[0]);
            }
            if (data.data !== undefined && data.data['clientPaymentToken'] && data.data['paymentTokenPrice']) {
              // TODO: trigger action
              this.validUseCredit(data.data);
            }
          });
        });
  }

  presentCreditCardModal() {
    return this.modalCtr.create({
      component: CardComponent,
      componentProps: {
        cards: this.cards,
      },
      cssClass: 'bottom-modal-class',
      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      mode: 'ios'
    }).then(mod => {
      mod.present().then();
      this.changeProvider(this.paymentsProvider[0]);
      return mod.onDidDismiss().then(data => {
        if (data.data !== undefined && data.data.selectedCard) {
          // TODO: trigger action
          this.selectedCreditCard = data.data.selectedCard;
          this.isCardSelected = true;
          this.triggerPaymentData.emit(true);
          this.creditCardSelected.emit(this.selectedCreditCard);
        }
      });
    });
  }

  presentWalletModal() {
    return this.modalCtr.create({
      component: WalletComponent,
      componentProps: {
        currency: this.booking.club.currency,
        wallet: this.client.wallet
      },
      cssClass: ['bottom-modal-class', 'pay-modal-css'],
      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      mode: 'ios'
    }).then(mod => {
      mod.present().then();
      return mod.onDidDismiss().then(data => {
        if(!data.data) {
          this.changeProvider(this.paymentsProvider[0]);
        }
        if (data.data !== undefined && data.data.wallet) {
          // TODO: trigger action
          this.triggerPaymentData.emit(true);
          this.validUseWallet(data.data.wallet);
        }
      });
    });
  }

  async validUseCredit(event) {
    this.withCredit = true;
    this.calculateRestToPay();

    let clientId = null;
    if (this.participant) {
      if (this.participant.client) {
        clientId = this.participant.client['@id'];
      }
    }
    let amountPaymentTokenPrice = 0;

    if (this.client.subscriptionCardsAvailable) {
      this.client.subscriptionCardsAvailable.forEach(subscriptionCard => {
        if ((this.booking && moment.utc(subscriptionCard.endDate) > moment(this.booking.endAt) && moment.utc(subscriptionCard.startDate) < moment(this.booking.startAt)) || !this.booking) {
          this.price.variations.forEach(variation => {
            variation.paymentTokenPrices.forEach(paymentTokenPrice => {
              if (
                  paymentTokenPrice.paymentToken['@id'] === event.paymentTokenPrice.paymentToken['@id'] &&
                  subscriptionCard.subscriptionPlan['@id'] === variation.subscriptionPlan['@id']
              ) {
                amountPaymentTokenPrice = variation.pricePerParticipant;
                event.paymentTokenPrice = paymentTokenPrice;
              }
            });
          });
        }
      });
    }

    let checked = 0;
    const discountParticipant = this.discountParticipantsCount ? this.discountParticipantsCount : 0;
    this.price.paymentTokenPrices.forEach(paymentTokenPrice => {
      if (paymentTokenPrice.id === event.paymentTokenPrice.id) {
        amountPaymentTokenPrice = this.price.pricePerParticipant;
        if(this.selectedMethod === "complete") {
          amountPaymentTokenPrice = 0;
          checked = 0;
          let balance = event.clientPaymentToken.balance;
          const pricePerParticipant = event.paymentTokenPrice.pricePerParticipant;
          for (let i = 0; i < this.booking.maxParticipantsCountLimit - discountParticipant; i++) {
            console.log(amountPaymentTokenPrice, this.price.pricePerParticipant, "<=== this.price.pricePerParticipant");
            console.log(balance, pricePerParticipant, "<=== clientPaymentToken");
            if(balance >= pricePerParticipant) {
              amountPaymentTokenPrice += this.price.pricePerParticipant;
              balance -= pricePerParticipant;
              checked += pricePerParticipant;
            }
          }
        }
      }
    });


    if (this.participant) {
      if (this.participant.category) {
        amountPaymentTokenPrice = this.participant.price;
      }
    }

    const paymentTokenIri = event.paymentTokenPrice.paymentToken['@id'];
    const paymentTokenIriAsArray = paymentTokenIri.split("/");
    const paymentTokenId = paymentTokenIriAsArray[paymentTokenIriAsArray.length - 1];

    const payment: Payment = {
      amount: amountPaymentTokenPrice,
      name: event.clientPaymentToken.name,
      cart: (this.cart ? this.cart['@id'] : null),
      client: clientId,
      currency: this.club.currency,
      method: 'card',
      provider: 'payment_token',
      userClient: this.user['@id'],
      metadata: {
        paymentTokenId,
        paymentTokenValue: checked > 0 ? checked : event.paymentTokenPrice.pricePerParticipant
      }
    };

    if (this.booking.payments === undefined) {
      this.booking.payments = [];
    }

    this.booking.payments.push(payment);
    this.backPayments.emit({booking: this.booking, restToPay: this.restToPay});
  }

  validUseWallet(event) {
    this.withWallet = true;
    this.paymentData(event);
    this.calculateRestToPay();
    let amount = this.restToPay;
    if (amount > this.client.wallet.balance) {
      amount = amount - (this.client.wallet.balance >= this.client.wallet.overdraftAuthorized ?
        this.client.wallet.balance + this.client.wallet.overdraftAuthorized : (this.client.wallet.balance > 0 ?
          this.client.wallet.balance + this.client.wallet.overdraftAuthorized : this.client.wallet.overdraftAuthorized + this.client.wallet.balance));

      amount = amount < 0 ? 0 : amount;
      amount = this.restToPay - amount;

    }

    let userClientIri = this.booking.userClient;
    if (this.booking.userClient) {
      userClientIri = this.booking.userClient['@id'];
    }
    let clientId = null;
    if (this.participant) {
      if (this.participant.client) {
        clientId = this.participant.client['@id'];
      }
    }
    const payment: Payment = {
      amount,
      client: clientId,
      cart: (this.cart ? this.cart['@id'] : null),
      currency: this.club.currency,
      method: 'card',
      provider: 'wallet',
      userClient: userClientIri
    };
    if (this.booking.payments === undefined) {
      this.booking.payments = [];
    }
    this.booking.payments.push(payment);

    this.calculateRestToPay();
    this.backPayments.emit({booking: this.booking, restToPay: this.restToPay});
  }

  calculateRestToPay() {
    let amount = 0;
    switch (this.booking.paymentMethod) {
      case this.PAYMENT_METHOD_PER_PARTICIPANT:
        if (this.participant) {
          amount = this.participant.price;
        }
        break;
      case this.PAYMENT_METHOD_ACOMPTE:
        amount = this.restToPay;
        break;
      default:
        amount = this.booking.price;
        break;
    }
    if (this.booking.payments) {
      this.booking.payments.forEach(payment => {
          switch (this.booking.paymentMethod) {
            case "per_participant":
              if (!payment["@id"]) {
                amount = amount - payment.amount;
              }
              break;
            default:
              amount = amount - payment.amount;
              if (amount < 0) {
                amount = 0;
              }
              break;
          }
      });
    }
    this.restToPay = amount;
  }

  removePayment(i) {
    this.selectedProvider = this.paymentsProvider[0];
    this.paymentData(false);
    this.booking.restToPay = this.realResToPay;
    const newPayments = [];
    this.booking.payments.forEach((item, index) => {
      if (index !== i) {
        newPayments.push(item);
      }
    });
    this.booking.payments = newPayments;
    if (!this.booking.payments.find(payment => payment.provider === 'payment_token')) {
      this.withCredit = false;
      this.changeProvider(this.paymentsProvider[0]);
      const walletIndex = this.booking.payments.findIndex(payment => payment.provider === 'wallet');
      if(walletIndex >= 0) {
        this.removePayment(walletIndex);
        this.validUseWallet(this.client.wallet);
      }
    }
    if (!this.booking.payments.find(payment => payment.provider === 'wallet')) {
      this.withWallet = false;
      this.changeProvider(this.paymentsProvider[0]);
    }

    this.calculateRestToPay();
    this.paymentData(false);
    this.backPayments.emit({booking: this.booking, restToPay: this.restToPay});
  }

  paymentData(event) {
    console.log(event, 'levent paymentData <===');
    this.triggerPaymentData.emit(event);
  }
}
