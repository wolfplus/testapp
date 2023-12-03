import { Component, Input, OnDestroy, OnInit, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { IonSelect, IonToggle, ModalController, Platform } from '@ionic/angular';
import { slideInSlideOut } from 'src/app/animations';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { DomSanitizer } from '@angular/platform-browser';
import { getClubCurrency } from 'src/app/club/store';
import { switchMap, tap, takeUntil, first } from 'rxjs/operators';
import { ClubState } from 'src/app/club/store/club.reducers';
import { Store, select } from '@ngrx/store';
import {iif, Observable, of, Subject, Subscription} from 'rxjs';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { PaymentCard } from 'src/app/shared/models/payment-card';
import { StripeService } from 'src/app/shared/services/payment/stripe.service';
import { Cart } from 'src/app/shared/models/cart';
import { BookingService } from 'src/app/shared/services/booking/booking.service';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import { ClubService } from 'src/app/shared/services/club/club.service';
import { CreditModalComponent } from 'src/app/shared/payment/payment-global/components/payment-selection/credit-modal/credit-modal.component';
import { CreditCardModalComponent } from 'src/app/shared/payment/payment-global/components/payment-selection/credit-card-modal/credit-card-modal.component';
import { ManagePaymentService } from 'src/app/shared/services/payment/manage-payment.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { PaymentMethods } from 'src/app/shared/models/booking';
import {getCurrentMe} from "../../../account/store";


@Component({
    selector: 'app-paiement',
    templateUrl: './paiement.component.html',
    styleUrls: ['./paiement.component.scss'],
    animations: [
        slideInSlideOut
    ]
})
export class CoursePaiementComponent implements OnInit, OnDestroy {

    @Input() booking;
    @Input() userMe;
    @Input() participated;
    @Input() cart: Cart;
    @Input() attenders: Array<any>;
    @Input() participant: any;

    clubReal: any;
    paymentCard: Array<PaymentCard>;
    imageUrl: string;
    baseUrl: string = this.environmentService.getEnvFile().domainAPI;
    countPlace = 1;
    avatarBgColor = 'lightGray';
    restToPay = 0;
    pathFile = this.environmentService.getEnvFile().pathFiles;
    priceTotalList: any;
    totalOption: any;
    club: any;
    paymentMetadata: any;
    defaultCard: any;
    //restToPay2: any;
    client: any;
    guid: any;

    price: any;
    wallet: any;
    loaded = false;
    selectedMethod: any;

    card$: Observable<any>;
    withWallet = false;
    withCredit = false;
    paymentsProvider: Array<string>;
    selectedProvider: string;
    cartPayment: any;
    isPaid = false;
    isReady = false;
    realClient: any;
    webStripeElementCompleted = false;
    clubCurrencySub: Subscription;
    clubCurrency: string;
    stripeAccountReference: string;

    public PAYMENT_METHOD_COMPLETE = 'complete';
    public PAYMENT_METHOD_PER_PARTICIPANT = 'per_participant';
    public PAYMENT_METHOD_DEPOSIT = 'deposit';
    public PAYMENT_METHOD_ON_THE_SPOT = 'on_the_spot';
    public PAYMENT_METHOD_ACOMPTE = 'instalment';
    methods: string[];

    selectedCredit: any;
    useWallet: boolean = false;
    private readonly ngUnsubscribe: Subject<void> = new Subject<void>();
    createdCart: any;
   // meParticipant: any;

   @ViewChild('select1') select1: IonSelect;

    constructor(
        //private modalCtrl: ModalController,
        private platform: Platform,
        //private loaderService: LoaderService,
        private stripeService: StripeService,
        //private paymentCardService: PaymentCardService,
        public sanitizer: DomSanitizer,
        private clubStore: Store<ClubState>,
        //private toastService: ToastService,
        private environmentService: EnvironmentService,
        private accountService: AccountService,
        //private managePaymentService: ManagePaymentService,
        private bookingService: BookingService,
        private accountStore: Store<any>,
        private clubIdStorageService: ClubIdStorageService,
        private clubService: ClubService,
        private modalController: ModalController,
        private managePaymentService: ManagePaymentService,
        private loaderService: LoaderService,
        private toastService: ToastService,
        @Inject(LOCALE_ID) public locale: string
    ) {
        this.stripeService.reloadStripeAccount();
        this.loaded = false;
        this.platform.backButton.subscribeWithPriority(101, async () => {
            this.dismiss();
        });
        this.paymentsProvider = environmentService.getEnvFile().paymentsProvider;
        this.selectedProvider = this.paymentsProvider[0];
        this.card$ = this.stripeService.card;
    }

    ngOnInit() {
        this.defaultCard = null;
        this.booking.payments = [];
        console.log(this.booking);

//    this.booking.price = this.cart['restToPay'];
        this.booking.restToPay = this.cart['restToPay'];
        this.restToPay = this.cart['restToPay'];
        //this.restToPay2 = this.restToPay;
        console.log(this.booking);
        console.log(this.attenders);
        this.initConf();
    }

    loadCards() {
        return this.stripeService.getPaymentSource(this.client.id, this.club.id)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                tap(respPSS => {
                    const cards: Array<any> = respPSS.sources.card;
                    if (cards) {
                        cards.forEach((card) => {
                            if (card.default === true) {
                                this.defaultCard = card;
                            }
                        });
                    }
                })
            );
    }

    initConf() {
        this.clubIdStorageService.getClubId().then(clubId => {
            this.guid = clubId;
            this.accountStore.select(getCurrentMe).pipe(
                switchMap(data => {
                    this.userMe = data;
                    return of(this.guid);
                }),
                switchMap((guid: string) => this.clubService.getClub(guid)),
                switchMap(club => {
                    this.clubReal = club;
                    this.club = club;
                    return this.accountService.getClientClub(this.userMe.id, this.guid);
                }),
                tap(async (response) => {

                    this.client = response['hydra:member'][0];
                    this.wallet = this.client.wallet;
                    this.useWallet = this.wallet.balance > 0;
                    this.createdCart = this.cart;
                    // this.selectedMethod = this.booking.paymentMethod;
                    // this.meParticipant = this.booking.participants.find(p => p['addedBy'] === null);
                    console.log(this.booking)
                    console.log(this.participant)
                    //if (this.meParticipant) this.meParticipant = this.userMe
                    this.price = this.booking.timetableBlockPrice['@id'];

                    // this.methods = ['per_participant', 'on_the_spot'];
                    // this.selectedMethod = this.methods[0];
                    // this.calculateToPay();

                    // await this.clubStore.pipe(
                    //     select(getClubCurrency),
                    //     tap((currency: any) => {
                    //         this.clubCurrency = currency;
                    //     })).subscribe();

                    // await this.clubStore.pipe(
                    //     select(getClubStripeAccountReference),
                    //     tap((res: any) => {
                    //         this.stripeAccountReference = res;
                    //     }),
                    // ).subscribe();

                    // this.clubStore.pipe(
                    //     select(getCurrentClub),
                    //     tap(club => {
                    //         this.club = club;
                    //         //this.getPaymentMethod();
                    //         //this.getPaymentCards();

                            
                    //     })
                    // );

                    if (this.clubReal){
                        this.stripeAccountReference = this.clubReal.stripeAccountReference;
                    }
                }),
                switchMap(() => this.bookingService.getPaymentMethod(this.booking.id)),
                tap((methods: PaymentMethods) => {
                    this.methods = methods.paymentMethods;
                    this.selectedMethod = this.methods[0];
                    this.calculateToPay();
                }),
                switchMap(() => this.clubStore.pipe(select(getClubCurrency))),
                tap((currency: any) => {
                    this.clubCurrency = currency;
                }),
                switchMap(() => this.loadCards()),
                ).subscribe(() => {
                    this.isReady = true;
                    this.loaded = true;
                });
        });
    }

    // ionViewWillEnter() {
    //     if (this.selectedProvider === 'orange_money') {
    //         this.checkOm();
    //     }
    // }

    // triggerPaymentData(result) {
    //     this.webStripeElementCompleted = result;
    // }


    // getPayments(event) {
    //     this.booking = event.booking;
    //     this.calculateRestToPay();
    // }


    async cancelBooking() {
        this.booking = await this.bookingService.get(this.booking['@id']).toPromise();
        this.booking.payments = [];

        await this.bookingService.getBookingParticipants(this.booking['@id'], this.userMe.id).subscribe(
            async (response) => {
                if ((response['hydra:member'] as Array<any>).length === 0)
                    return;

                const userHere = response['hydra:member'][0];
                await this.bookingService.updateParticipantCourse({canceled: true, accompanyingParticipants: []}, userHere['@id'])
                    .subscribe(
                    async () => {
                        this.booking = await this.bookingService.get(this.booking['@id']).toPromise();
                    }
                );
            }
        );
    }

    // calculateRestToPay() {
    //     let amount = this.restToPay;
    //     switch (this.selectedMethod) {
    //         case 'per_participant':
    //             amount = amount;
    //             break;
    //     }
    //     if (this.booking.payments) {
    //         this.booking.payments.forEach(payment => {
    //             switch (payment.provider) {
    //                 case 'payment_token':
    //                     amount = amount - payment.amount;
    //                     break;
    //                 case 'wallet':
    //                     amount = amount - payment.amount;
    //                     break;
    //             }
    //         });
    //     }

    //     this.restToPay = amount;
    //     this.restToPay2 = amount;
    // }


    // changeMethod(event) {
    //     this.selectedMethod = event;
    //     this.booking.paymentMethod = this.selectedMethod;
    //     this.calculateRestToPay();
    // }


    // checkOm() {
    // }

    // changeProvider(event) {
    //     this.selectedProvider = event;
    // }

    // updateSelectedCard(event) {
    //     this.defaultCard = event;
    //     if (this.defaultCard != null) {
    //         this.restToPay2 = 0;
    //     }
    //     this.stripeService.setCard(this.defaultCard);
    // }

    dismiss() {
        this.modalController.dismiss(this.isPaid);
    }

    // getPaymentMethod() {
    //     this.paymentCardService.getAllPaymentCards()
    //         .then((result: any) => {
    //             this.paymentCard = result;
    //         });
    // }

    // getPaymentCards() {
    //     this.paymentCardService.getDefaultPaymentCard()
    //         .then(cardsString => {
    //             this.defaultCard = null;
    //             const arrayData: Array<PaymentCard> = JSON.parse(cardsString.value);
    //             if (arrayData) {
    //                 arrayData.forEach(item => {
    //                     if (item.default) {
    //                         this.defaultCard = item;
    //                     }
    //                 });
    //             }
    //         });
    // }

    // async confirmPayments() {
    //     this.loaderService.presentLoading();

    //     // let paymentsSent = 0;
    //     // let clientId;
    //     const temp = [];
    //     if (this.booking.payments) {
    //         this.booking.payments.forEach((element, index) => {
    //             this.booking.payments[index].client = this.client['@id'];
    //             if (element.payment !== undefined) {
    //                 if (element.payment.status !== "refunded" && element.payment.status !== "processing") {
    //                     temp.push(element);
    //                 }
    //             }  else {
    //                 temp.push(element);
    //             }
    //         });
    //         this.booking.payments = temp;
    //     }

    //     if (this.booking.payments.length > 0) {
    //         this.managePaymentService.sendPayments(this.booking.payments)
    //             .pipe(
    //                 // tap(resp => {
    //                 //     paymentsSent += 1;
    //                 // }),
    //                 last(),
    //                 tap(() => {
    //                     this.calculateRestToPay();
    //                 }),
    //                 filter(payment => payment !== undefined),
    //                 map(payment => {
    //                     return payment;
    //                 })
    //             )
    //             .subscribe((paymentData) => {
    //                 if (this.restToPay > 0 && paymentData) {
    //                     // this.restToPay = this.booking.restToPay;
    //                     // if (this.client['@id']) {
    //                     //     clientId = this.client['@id'];
    //                     // }
    //                     this.managePaymentService.createPaymentBooking(
    //                         this.booking,
    //                         this.cart,
    //                         this.selectedProvider,
    //                         'card',
    //                         this.club.currency,
    //                         this.restToPay,
    //                         this.client['@id'],
    //                         this.booking.userClient
    //                     )
    //                         .pipe(
    //                             filter(payment => payment !== undefined),
    //                             tap(payment => {
    //                                 this.managePaymentResponse(payment, this.client['@id']);
    //                             })
    //                         )
    //                         .subscribe();

    //                 } else if (paymentData && this.restToPay <= 0) {
    //                     this.managePaymentResponse(paymentData, this.client['@id']);
    //                 } else if (!paymentData) {
    //                     this.toastService.presentError('Problème lors du paiement, réessaye !');
    //                 }
    //             });
    //     } else {
    //         if (this.restToPay > 0) {

    //             // if (this.client['@id']) {
    //             //     clientId = this.client['@id'];
    //             // }
    //             this.managePaymentService.createPaymentBooking(
    //                 this.booking,
    //                 this.cart,
    //                 this.selectedProvider,
    //                 'card',
    //                 this.club.currency,
    //                 this.restToPay,
    //                 this.client['@id'],
    //                 this.booking.userClient
    //             )
    //                 .pipe(
    //                     filter(payment => payment !== undefined),
    //                     tap(payment => {
    //                         this.managePaymentResponse(payment, this.client['@id']);
    //                     })
    //                 )
    //                 .subscribe();
    //         }
    //     }
    // }



    // async managePaymentResponse(payment, clientId) {
    //     this.stripeAccountReference = this.clubReal.stripeAccountReference;
    //     switch (payment.provider) {
    //         case 'stripe':
    //             this.stripeService.clientSecret = payment.metadata.clientSecret;
    //             if (this.platform.is("mobileweb") || this.platform.is("desktop")) {
    //                 this.stripeService.confirmWebPayment()
    //                     .then(res => {
    //                         if (!res.paymentIntent) {
    //                             res = JSON.parse(res);
    //                         }
    //                         if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
    //                             this.modalCtrl.dismiss({ booking: this.booking, success: true }).then(() => {
    //                                 this.toastService.presentSuccess('payment_booking_succeeded');
    //                                 this.loaderService.dismiss();
    //                                 this.modalCtrl.create({
    //                                     component: BookingSuccesModalComponent,
    //                                     componentProps: {
    //                                         bookingIRI: this.booking.id,
    //                                         msgCourse: 'course_validated'
    //                                     },
    //                                     animated: true
    //                                 })
    //                                     .then(modal => {
    //                                         modal.onDidDismiss()
    //                                             .then(() => {
    //                                                 this.isPaid = true;
    //                                                 modal.dismiss().then(_ => this.dismiss());
    //                                             });
    //                                         modal.present();
    //                                     });
    //                                 if (this.environmentService.isThisMB('padelhorizon')) {
    //                                     window.location.href = "https://www.padel-horizon.com/merci/";
    //                                 }
    //                             });
    //                         }
    //                     })
    //                     .catch(() => {
    //                         this.loaderService.dismiss();
    //                     });
    //             } else {
    //                 this.stripeService.confirmPayment(this.defaultCard, this.stripeAccountReference, clientId)
    //                     .then(res => {
    //                         if (!res.paymentIntent) {
    //                             res = JSON.parse(res);
    //                         }
    //                         if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
    //                             this.modalCtrl.dismiss({ booking: this.booking, success: true }).then(() => {
    //                                 this.toastService.presentSuccess('payment_booking_succeeded');
    //                                 this.loaderService.dismiss();
    //                                 this.modalCtrl.create({
    //                                     component: BookingSuccesModalComponent,
    //                                     componentProps: {
    //                                         bookingIRI: this.booking.id,
    //                                         msgCourse: 'course_validated'
    //                                     },
    //                                     animated: true
    //                                 })
    //                                     .then(modal => {
    //                                         modal.onDidDismiss()
    //                                             .then(() => {
    //                                                 this.isPaid = true;
    //                                                 modal.dismiss().then(_ => this.dismiss());
    //                                             });
    //                                         modal.present();
    //                                     });
    //                                 if (this.environmentService.isThisMB('padelhorizon')) {
    //                                     window.location.href = "https://www.padel-horizon.com/merci/";
    //                                 }
    //                             });
    //                         }
    //                     })
    //                     .catch(() => {
    //                         this.loaderService.dismiss();
    //                     });
    //             }
    //             break;
    //         case 'payment_token':
    //         case 'wallet':
    //             if (payment.status === 'succeeded') {
    //                 this.modalCtrl.dismiss({ booking: this.booking, success: true }).then(() => {
    //                 this.loaderService.dismiss();
    //                 this.toastService.presentSuccess('payment_booking_succeeded');
    //                 this.modalCtrl.create({
    //                     component: BookingSuccesModalComponent,
    //                     componentProps: {
    //                         bookingIRI: this.booking.id,
    //                         msgCourse: 'course_validated'
    //                     },
    //                     animated: true
    //                 })
    //                     .then(modal => {
    //                         modal.onDidDismiss()
    //                             .then(() => {
    //                                 this.isPaid = true;
    //                                 modal.dismiss().then(_ => this.dismiss());
    //                             });
    //                         modal.present();
    //                     });
    //                 });
    //             }
    //             break;
    //     }
    // }

    ngOnDestroy(): void {
        if (this.isPaid === false) {
            this.cancelBooking();
        }
    }

    deleteCredit() {
        this.selectedCredit = null;
    }


    calculateToPay() {
        let amount = 0;
        switch (this.selectedMethod) {
            case this.PAYMENT_METHOD_PER_PARTICIPANT:
                amount = this.participant.price;
                break;
            case this.PAYMENT_METHOD_ACOMPTE:
            default:
                amount = this.booking.price;
                break;
        }
        this.restToPay = amount;
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

    changeSelectedMethod() {
        this.deleteCredit();
        //this.deleteCard();

        this.bookingService.updateParticipantCourse({paymentMethod: this.selectedMethod}, this.participant['@id'])
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
                console.log(data);
                this.participant = data;
                this.restToPay = null;
                this.calculateToPay();
            }
        );
        
    }

    deleteCard() {
        this.defaultCard = null;
    }

    showCreditModal() {
        // this.platform.keyboardDidShow
        // if (this.selectedCard || this.useWallet) {
        //     return;
        // }
        this.modalController.create({
            component: CreditModalComponent,
            componentProps: {
                cart: this.createdCart,
                client: this.client,
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
                user: this.userMe,
                client: this.client,
                club: this.club,
                selectedCard: this.defaultCard
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
                        this.defaultCard = data.data;
                        this.deleteCredit();
                    }
                });
            });
    }

    openSelect(){
        this.select1.open();
    }

    toggleUseWallet(toggle: IonToggle) {
        this.useWallet = toggle.checked;
        if (this.useWallet) {
           this.selectedCredit = null;
        }
    }

    validatePayment() {
        console.log(this.selectedMethod);
        if (this.selectedMethod === 'complete' || this.selectedMethod === 'per_participant' || this.selectedMethod === 'instalment' || this.selectedMethod === 'per_participant_by_deposit') {
            if (this.selectedCredit) {
                this.payWithCreditOnly();
            }
            if (this.useWallet && !this.defaultCard && this.wallet.balance > 0) {
                this.payWithWallet();
            }
            if (this.defaultCard && !this.useWallet) {
                this.payWithCardOnly();
            }
            if (this.defaultCard && this.useWallet) {
                this.payWithCardAndWallet();
            }
        }
        if (this.selectedMethod === 'deposit') {
            this.payByDeposit();
        }

        if (this.selectedMethod === 'on_the_spot') {
            this.payOnTheSpot();
        }
    }


    payWithWallet() {
        this.loaderService.presentLoading();

        const payment: /*Payment*/ any = {
            amount: this.wallet.balance >= this.restToPay ? this.restToPay : this.wallet.balance,
            client: this.client['@id'],
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
                        this.restToPay = respPayment.cart.restToPay;
                        if (this.restToPay <= 0) {
                            this.isPaid = true;
                            this.dismiss();
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
        if(this.restToPay < 50) {
            return this.toastService.presentError('strip_minimal_amount', 'top');
        }
        if (this.selectedMethod === 'per_participant_by_deposit') {
            this.payByDeposit();
            return;
        }
        this.loaderService.presentLoading();

        const payment: /*Payment*/ any = {
            amount: this.restToPay,
            client: this.client['@id'],
            cart: (this.createdCart ? this.createdCart['@id'] : null),
            currency: this.club.currency,
            method: 'card',
            provider: 'stripe',
            metadata: {
                stripeSourceId: this.defaultCard.id
            }
        };
        this.managePaymentService.addPayment(payment)
            .pipe(first())
            .subscribe((respPayment) => {
                if(respPayment && respPayment.status === 'succeeded') {
                    this.stripeService.setDefaultPaymentSource(this.userMe.id, this.club.id, this.defaultCard.id)
                        .pipe(first())
                        .subscribe(() => {
                            this.loaderService.dismiss();
                            this.restToPay = respPayment.cart.restToPay;
                            if (this.restToPay <= 0) {
                                this.isPaid = true;
                                this.dismiss();
                            }
                        });
                } else if(respPayment && (respPayment.status === 'requires_action' || respPayment.status === 'processing')) {
                    this.stripeService.stripeV3.confirmCardPayment(respPayment.metadata.clientSecret, {
                        payment_method: this.defaultCard.id
                    }).then((resp) => {
                        if(resp.paymentIntent && resp.paymentIntent.status == "succeeded") {
                            this.loaderService.dismiss();
                            this.restToPay = respPayment.cart.restToPay - resp.paymentIntent.amount;
                            if (this.restToPay <= 0) {
                                this.isPaid = true;
                                this.dismiss();
                            }
                        } else {
                            this.loaderService.dismiss();
                            this.toastService.presentError('booking_payment_aborted', 'top');
                        }
                    });
                } else {
                    this.loaderService.dismiss();
                    this.toastService.presentError('booking_payment_aborted', 'top');
                }

            });
    }

    payWithCreditOnly() {
        this.loaderService.presentLoading();

        const payment: /*Payment*/ any = {
            amount: this.restToPay,
            metadata: {
                paymentTokenId: this.selectedCredit.paymentToken.id,
                paymentTokenValue:  this.selectedCredit.price
            },
            client: this.client['@id'],
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
                        this.restToPay = respPayment.cart.restToPay;
                        if (this.restToPay <= 0) {
                            this.isPaid = true;
                            this.dismiss();
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
            amount: this.restToPay,
            client: this.client['@id'],
            cart: (this.createdCart ? this.createdCart['@id'] : null),
            currency: this.club.currency,
            method: 'card',
            captureMethod: 'manual',
            provider: 'stripe',
            metadata: {
                stripeSourceId: this.defaultCard.id
            }
        };
        this.managePaymentService.addPayment(payment)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                switchMap((respPayment) => iif(
                    () => respPayment && respPayment.status === 'requires_capture',
                    this.stripeService.setDefaultPaymentSource(this.userMe.id, this.club.id, this.defaultCard.id)
                    .pipe(
                        tap(() => {
                            this.loaderService.dismiss();
                            this.restToPay = respPayment.cart.restToPay;
                            this.isPaid = true;
                            this.dismiss();
                        })
                    ),
                    new Observable((subscriber) => {
                        this.loaderService.dismiss();
                        this.toastService.presentError('booking_payment_aborted', 'top');
                        subscriber.next();
                        subscriber.complete();
                      })
                ))
            )
            .subscribe();
    }

    payOnTheSpot() {
        this.loaderService.presentLoading();

        this.bookingService.updateParticipantCourse({confirmed: true}, this.participant['@id'])
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
                console.log(data);
                this.loaderService.dismiss();

                if (data.confirmed === true) {
                    this.isPaid = true;
                    this.dismiss();
                } else {
                    this.toastService.presentError('booking_payment_aborted', 'top');
                }
            }
        );
    }
    
}
