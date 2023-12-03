import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { ModalController, ViewWillEnter, Platform } from '@ionic/angular';
import { filter, tap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { Store, select } from '@ngrx/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/storage/user.service';
import { getClubCurrency, getClubStripeAccountReference, getCurrentClubPhotos } from 'src/app/club/store';
import { Payment } from 'src/app/shared/models/payment';
import { ManagePaymentService } from 'src/app/shared/services/payment/manage-payment.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { CartState } from 'src/app/shop/state/cart.state';
import { ToastService } from 'src/app/shared/services/toast.service';
import { PaymentCardService } from 'src/app/shared/services/storage/payment-card.service';
import { PaymentCard } from 'src/app/shared/models/payment-card';
import { CardComponent } from 'src/app/components/payments/card/card.component';
import { StripeService } from 'src/app/shared/services/payment/stripe.service';

// const amountMax = 1000;
// const numberDigits = 2;

@Component({
    selector: 'app-my-wallets-refill',
    templateUrl: './refill.component.html',
    styleUrls: ['./refill.component.scss']
})
export class RefillComponent implements OnInit, ViewWillEnter, OnDestroy {

    @ViewChild('autofocus', { static: false }) searchbar
    wallet: any;
    client: any;
    cartId: string;
    defaultCard: any = null;
    pathUrl: string;
    env;
    showSkeleton = true;
    amountSelected: number = null;

    clubCurrencySub: Subscription;
    clubCurrency: string;
    clubPhotoUrl: string;
    payments: Array<Payment> = [];
    alreadyPaid: number;

    cards: Array<PaymentCard>;
    selectedCreditCard: any = null;
    carts: any;
    cartPayment: any;

    amountAdded = null;
    stripeAccountReference: string;

    constructor(
        private modalCtrl: ModalController,
        private modalCtr: ModalController,
        public cartState: CartState,
        private toastService: ToastService,
        private clubStore: Store<ClubState>,
        private ref: ChangeDetectorRef,
        public  platform: Platform,
        private managePaymentService: ManagePaymentService,
        private environmentService: EnvironmentService,
        private userService: UserService,
        private loaderService: LoaderService,
        private cd: ChangeDetectorRef,
        private stripeService: StripeService,
        private paymentCardService: PaymentCardService,
    ) {
        this.stripeService.reloadStripeAccount();
        this.env = this.environmentService.getEnvFile();
        this.pathUrl = environmentService.getEnvFile().pathFiles;
    }


    ngOnInit(): void {
        this.loadData();
        this.getAllCards();
        this.showSkeleton = false;
    }

    loadData() {
        this.clubCurrencySub = this.clubStore.pipe(
            select(getClubCurrency),
            tap(currency => this.clubCurrency = currency)
        ).subscribe();

        this.clubCurrencySub = this.clubStore.pipe(
            select(getCurrentClubPhotos),
            tap(photos => this.clubPhotoUrl = this.environmentService.getEnvFile().pathFiles + photos[0].contentUrl),
        ).subscribe();

        this.clubCurrencySub = this.clubStore.pipe(
            select(getClubStripeAccountReference),
            tap(res => this.stripeAccountReference = res),
        ).subscribe();

        this.userService.get()
            .pipe(
                tap(user => {
                    this.client = user;
                })).subscribe();
    }

    paymentCB() {
        if (this.stripeService.getCard() === undefined && this.selectedCreditCard == null) {
            this.toastService.presentError('no-card', 'top');
            return;
        }
        this.amountAdded = null;
        this.loaderService.presentLoading();

        this.carts = {
            items: [{
                quantity: this.amountSelected * 100,
                product: `/clubs/clients/wallets/${this.wallet.id}`
            }]
        };

        this.managePaymentService.createCart(this.carts).subscribe(
            (res) => {
                this.cartPayment = {
                    // client: this.client.clubClientId,
                    client: this.wallet.client,
                    provider: 'stripe',
                    currency: this.clubCurrency,
                    cart: res['@id'],
                    method: 'card',
                    amount: parseInt('' + (this.amountSelected * 100), 10),
                };

                this.managePaymentService.addPayment(
                    this.cartPayment
                )
                    .pipe(
                        filter(result => result !== undefined),
                        tap(result => {
                            this.stripeService.clientSecret = result.metadata.clientSecret;
                            if (this.platform.is("desktop") || this.platform.is('mobileweb')) {
                                this.stripeService.confirmWebPayment()
                                .then(res => {
                                    if (!res.paymentIntent) {
                                    res = JSON.parse(res);
                                    }
                                    if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
                                        this.paymentSuccess();
                                    }
                                });
                            } else {
                                this.stripeService.setCard(this.defaultCard);
                            this.managePaymentService.managePaymentResponse(
                                result, this.wallet.client, this.defaultCard, this.stripeAccountReference).then(() => {
                                    this.paymentSuccess();
                                }
                            ).catch(() => {
                                this.loaderService.dismiss().then();
                            });
                            }

                        })
                    )
                    .subscribe();
            },
            () => {
                this.toastService.presentError('an_error_has_occured', 'top');
            }
        );
    }

    paymentSuccess(){
        this.amountAdded = this.amountSelected;
        this.toastService.presentSuccess('shop_pay_success', 'top');
        this.loaderService.dismiss();
        this.close();
        this.ref.markForCheck();
    }

    ngOnDestroy(){
        if (this.clubCurrencySub) {
            this.clubCurrencySub.unsubscribe();
        }
    }

    ionViewWillEnter() {
        setTimeout(() => this.searchbar.setFocus(), 300);
    }


    close() {
        if (this.amountAdded != null) {
            this.modalCtrl.dismiss({amountRefresh: true, amountAdded: this.amountSelected});
        } else {
            this.modalCtrl.dismiss({refresh: true});
        }

    }

    numberOnlyValidation(event: any) {
        const pattern = /^(\d{0,3}(\.\d{0,2})?)$/;
        const inputChar = String.fromCharCode(event.charCode);

        if (this.amountSelected != null && this.amountSelected.toString().length > 3) {
            event.preventDefault();
        }

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    getAllCards() {
        this.paymentCardService.getAllPaymentCards()
            .then(data => {
                if (data) {
                    this.cards = data;
                    this.selectedCreditCard = this.cards.find(card => card.default === true);
                    this.creditCardSelected(this.selectedCreditCard);
                    this.cd.markForCheck();
                }
            });
    }

    creditCardSelected(card) {
        this.defaultCard = card;
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
            return mod.onDidDismiss().then(data => {
                if (data.data !== undefined && data.data.selectedCard) {
                    this.selectedCreditCard = data.data.selectedCard;
                    this.creditCardSelected(this.selectedCreditCard);
                }
            });
        });
    }
}
