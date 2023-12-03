import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {EnvironmentService} from "../../shared/services/environment/environment.service";
import {Cart} from "../../shared/models/cart";
import {Observable} from "rxjs";
import {PaymentCardService} from "../../shared/services/storage/payment-card.service";
import {StripeService} from "../../shared/services/payment/stripe.service";
import {ToastService} from "../../shared/services/toast.service";
import {BrowserWeb} from "@capacitor/browser/dist/esm/web";
import { ClientClub } from 'src/app/shared/models/client-club';

@Component({
  selector: 'app-process-cart-payment',
  templateUrl: './process-cart-payment.component.html',
  styleUrls: ['./process-cart-payment.component.scss'],
  providers: [BrowserWeb]
})
export class ProcessCartPaymentComponent implements OnInit {

  @Input() subscription: any;
  @Input() club: any;

  photoClub = null;


  cart: Cart;
  client: ClientClub;
  defaultCard: any;
  withCredit = false;
  withWallet = false;
  paymentCard: any;
  card$: Observable<any>;

  checkCondition = false;

  constructor(
      private modalCtrl: ModalController,
      private envServ: EnvironmentService,
      private browser: BrowserWeb,
      private toastService: ToastService,

      private paymentCardService: PaymentCardService,
      private stripeService: StripeService
  ) {
    this.stripeService.reloadStripeAccount();
  }

  ngOnInit(): void {
    this.photoClub = this.envServ.getEnvFile().pathFiles + this.getImageClub();
    this.getPaymentCards();
  }
  showConditions() {
    this.browser.open({
      url: 'https://doinsport.com/mentions-legales',
      presentationStyle: 'fullscreen'
    }).then();
  }
  getImageClub() {
    if (this.club.photos && this.club.photos.length > 0) {
      return this.club.photos[0].contentUrl;
    }

    return null;
  }
  confirm() {
    this.toastService.presentError('[Error DEMO] : Il semblerait que la souscription d\'abonnement ne soit pas activé.');

  }
  close() {
    this.modalCtrl.dismiss({}, null, 'modal-process-payment').then();
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

  totalToPay() {
    return this.subscription.amount;
  }

  confirmPayments() {

  }

  getPayments() {

  }
  changeProvider() {

  }
  triggerPaymentData() {

  }
}
