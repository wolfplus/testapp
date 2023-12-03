import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {IonToggle, ModalController, Platform} from "@ionic/angular";
import {CreditModalComponent} from "./credit-modal/credit-modal.component";
import {BookingService} from "../../../../services/booking/booking.service";
import {first, takeUntil, tap} from "rxjs/operators";
import {Components} from "@ionic/core";
import IonSelect = Components.IonSelect;
import {ManagePaymentService} from "../../../../services/payment/manage-payment.service";
import {CreditCardModalComponent} from "./credit-card-modal/credit-card-modal.component";
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment-selection',
  templateUrl: './payment-selection.component.html',
  styleUrls: ['./payment-selection.component.scss'],
  animations: [
    trigger(
        'fadeInFadeOut',
        [
          transition(
              ':enter',
              [
                style({ opacity: 0 }),
                animate('.5s ease-in',
                    style({ opacity: 0.2 }))
              ]
          ),
          transition(
              ':leave',
              [
                style({ opacity: 0.2}),
                animate('5s ease-out',
                    style({ opacity: 0 }))
              ]
          )
        ]
    ),
    trigger(
        'slideInSlideOut',
        [
          transition(
              ':enter',
              [
                style({ bottom: '-100%' }),
                animate('.5s ease-in',
                    style({ bottom: 0 }))
              ]
          ),
          transition(
              ':leave',
              [
                style({ bottom: 0}),
                animate('1s ease-out',
                    style({ bottom: '-100%' }))
              ]
          )
        ]
    )
  ]
})
export class PaymentSelectionComponent implements OnInit, OnDestroy {

    @Input() wallet;
    @Input() booking;
    @Input() club: any;
    @Input() slot?: any;
    @Input() methods?: Array<string> = new Array<string>();
    @Input() createdCart: any;
    meParticipant: any;

    hasValidCard: any;

    useWallet: boolean;

    resetCard = false;

    @ViewChild('select1') select1: IonSelect;

    public PAYMENT_METHOD_COMPLETE = 'complete';
    public PAYMENT_METHOD_PER_PARTICIPANT = 'per_participant';
    public PAYMENT_METHOD_DEPOSIT = 'deposit';
    public PAYMENT_METHOD_ON_THE_SPOT = 'on_the_spot';
    public PAYMENT_METHOD_ACOMPTE = 'instalment';
    toPay;
    restToPay;

    selectedMethod: any;

    selectedCredit: any;

    selectedCard: any;

    paymentSources: Array<any>;

    @Output() closeModal = new EventEmitter();

    private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private modalController: ModalController,
    private bookingService: BookingService,
    private managePaymentService: ManagePaymentService,
    public platform: Platform,
    private loaderService: LoaderService,
    private toastService: ToastService,
    //private renderer: Renderer2
   ) { 
    // this.platform.keyboardDidShow.pipe(
    //     takeUntil(this.ngUnsubscribe)
    // ).subscribe(ev => {
    //     const els = document.getElementsByClassName('credit-modal');

    //     if (els.length > 0) {
    //         this.renderer.setStyle(els.item(0), '--height', '100vh');
    //         this.renderer.setStyle(els.item(0), 'height', '100vh');
    //     }
    // });
    
    //   this.platform.keyboardDidHide.pipe(
    //     takeUntil(this.ngUnsubscribe)
    //   ).subscribe(() => {
    //     const els = document.getElementsByClassName('credit-modal');

    //     if (els.length > 0) {
    //         this.renderer.setStyle(els.item(0), '--height', '80vh');
    //         this.renderer.setStyle(els.item(0), 'height', '80vh');
    //     }
    //   });
   }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

  ngOnInit(): void {
      this.selectedMethod = this.booking.paymentMethod;
      this.meParticipant = this.booking.participants.find(p => p['addedBy'] === null);
      this.useWallet = this.wallet.balance > 0;
      this.calculateToPay();
  }

    onBackBtnClicked() {
        this.closeModal.emit(false);
    }

    changeSelectedMethod() {
        this.deleteCredit();
        //this.deleteCard();
        this.booking.paymentMethod = this.selectedMethod;
        const serializedBooking = this.serializeBooking();
        this.toPay = null;
        this.bookingService.updateBooking(serializedBooking)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                tap(data => {
                    this.booking = data;
                    this.calculateToPay();
                })
            )
            .subscribe();
    }

    calculateToPay() {
        let amount = 0;
        switch (this.selectedMethod) {
            case this.PAYMENT_METHOD_PER_PARTICIPANT:
                amount = this.meParticipant.price;
                break;
            case this.PAYMENT_METHOD_ACOMPTE:
                if (this.slot) {
                    if (this.slot.prices[0].instalmentAmount) {
                        amount = this.slot.prices[0].instalmentAmount
                    } else {
                        if (this.slot.instalmentPercentage) {
                            amount = parseInt('' + (this.booking.price * (this.slot.instalmentPercentage / 100)));
                        }
                    }
                } else {
                    amount = this.booking.price;
                }
                break;
            default:
                amount = this.booking.price;
                break;
        }
        this.toPay = amount;
        /*if (this.booking.payments) {
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
        }*/
    }

    calculateRestToPay() {
    }

    showCreditModal() {
        this.platform.keyboardDidShow
        // if (this.selectedCard || this.useWallet) {
        //     return;
        // }
        this.modalController.create({
            component: CreditModalComponent,
            componentProps: {
                cart: this.createdCart,
                client: this.meParticipant.client,
                selectedCredit: this.selectedCredit
            },
            cssClass: 'credit-modal',
            swipeToClose: true,
            backdropDismiss: true,
            mode: 'ios',
        })
            .then(mod => {
                mod.present().then();
                return mod.onDidDismiss().then(data => {
                    if (data.data) {
                        this.selectedCredit = data.data;
                        this.useWallet = false;
                        this.deleteCard();
                    }
                });
            });
    }

    showCreditCardModal() {
        // if (this.selectedCredit) {
        //     return;
        // }
        this.modalController.create({
            component: CreditCardModalComponent,
            componentProps: {
                client: this.meParticipant.client,
                user: this.meParticipant.user,
                club: this.club,
                selectedCard: this.selectedCard
            },
            cssClass: 'credit-modal',
            //cssClass: 'sign-class',
            swipeToClose: true,
            backdropDismiss: true,
            mode: 'ios',

        })
            .then(mod => {
                mod.present().then();
                return mod.onDidDismiss().then(data => {
                    if (data.data) {
                        this.selectedCard = data.data;
                        this.deleteCredit();
                    }
                });
            });
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

    openSelect(){
        this.select1.open();
    }

    deleteCredit() {
      this.selectedCredit = null;
    }

    deleteCard() {
        this.selectedCard = null;
    }

    validatePayment() {
        console.log(this.selectedMethod);
      if (this.selectedMethod === 'complete' || this.selectedMethod === 'per_participant' || this.selectedMethod === 'instalment') {
          if (this.selectedCredit) {
              this.payWithCreditOnly();
          }
          if (this.useWallet && !this.selectedCard && this.wallet.balance > 0) {
              this.payWithWallet();
          }
          if (this.selectedCard && !this.useWallet) {
              this.payWithCardOnly();
          }
          if (this.selectedCard && this.useWallet) {
              this.payWithCardAndWallet();
          }
      }
        if (this.selectedMethod === 'deposit') {
            this.payByDeposit();
        }
    }

    payWithWallet() {
        this.loaderService.presentLoading();

        const payment: /*Payment*/ any = {
            amount: this.wallet.balance >= this.toPay ? this.toPay : this.wallet.balance,
            client: this.meParticipant.client['@id'],
            cart: (this.createdCart ? this.createdCart['@id'] : null),
            currency: this.club.currency,
            provider: 'wallet'
        };
        this.managePaymentService.addPayment(payment)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                first(),
                tap(respPayment => {
                    console.log("respPayment", respPayment);
                    this.loaderService.dismiss();

                    if (respPayment.status === 'succeeded') {
                        this.toPay = respPayment.cart.restToPay;
                        if (this.toPay <= 0) {
                            console.log("emit ici booking", this.booking);
                            this.closeModal.emit({success: true, booking: this.booking});
                        } else {
                            this.payWithCardOnly();
                        }
                    } else {
                        this.toastService.presentError('booking_payment_aborted', 'top');
                    }
                })
            )
            .subscribe();
    }

    payWithCardOnly() {
        this.loaderService.presentLoading();

        const payment: /*Payment*/ any = {
            amount: this.toPay,
            client: this.meParticipant.client['@id'],
            cart: (this.createdCart ? this.createdCart['@id'] : null),
            currency: this.club.currency,
            method: 'card',
            provider: 'stripe',
            metadata: {
                stripeSourceId: this.selectedCard.id
            }
        };
        this.managePaymentService.addPayment(payment)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                tap(respPayment => {
                    this.loaderService.dismiss();

                    if (respPayment.status === 'succeeded') {
                        this.toPay = respPayment.cart.restToPay;
                        if (this.toPay <= 0) {
                            this.closeModal.emit({success: true, booking: this.booking});
                        }
                    } else {
                        this.toastService.presentError('booking_payment_aborted', 'top');
                    }
                })
            )
            .subscribe()
    }

    payWithCreditOnly() {
        this.loaderService.presentLoading();

        const payment: /*Payment*/ any = {
            amount: this.toPay,
            metadata: {
                paymentTokenId: this.selectedCredit.paymentToken.id,
                paymentTokenValue:  this.selectedCredit.price
            },
            client: this.meParticipant.client['@id'],
            cart: (this.createdCart ? this.createdCart['@id'] : null),
            currency: this.club.currency,
            provider: 'payment_token'
        };
        this.managePaymentService.addPayment(payment)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                first(),
                tap(respPayment => {
                    console.log("respPayment", respPayment);
                    this.loaderService.dismiss();

                    if (respPayment.status === 'succeeded') {
                        this.toPay = respPayment.cart.restToPay;
                        if (this.toPay <= 0) {
                            this.closeModal.emit({success: true, booking: this.booking});
                        }
                    } else {
                        this.toastService.presentError('booking_payment_aborted', 'top');
                    }
                })
            )
            .subscribe();
    }

    payWithCardAndWallet() {
        if (this.wallet && this.wallet.balance > 0) {
            this.payWithWallet();
        }

        if ((this.wallet && this.wallet.balance <= 0) || !this.wallet) {
            this.payWithCardOnly();
        }
    }

    payByDeposit() {
        this.loaderService.presentLoading();

        const payment: /*Payment*/ any = {
            amount: this.toPay,
            client: this.meParticipant.client['@id'],
            cart: (this.createdCart ? this.createdCart['@id'] : null),
            currency: this.club.currency,
            method: 'card',
            captureMethod: 'manual',
            provider: 'stripe',
            metadata: {
                stripeSourceId: this.selectedCard.id
            }
        };
        this.managePaymentService.addPayment(payment)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                tap(respPayment => {
                    console.log(respPayment)
                    this.loaderService.dismiss();

                    if (respPayment.status === 'requires_capture') {
                        this.toPay = respPayment.cart.restToPay;
                        this.closeModal.emit({success: true, booking: this.booking});
                    } else {
                        this.toastService.presentError('booking_payment_aborted', 'top');
                    }
                })
            )
            .subscribe();
    }

    toggleUseWallet(toggle: IonToggle) {
        this.useWallet = toggle.checked;
        if (this.useWallet) {
           this.selectedCredit = null;
        }
    }

}
