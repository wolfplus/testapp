import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PaymentCardService } from '../../shared/services/storage/payment-card.service';
import { PaymentCard } from '../../shared/models/payment-card';
import { StripeService } from '../../shared/services/payment/stripe.service';

@Component({
  selector: 'app-my-payment-type',
  templateUrl: './my-payment-type.component.html',
  styleUrls: ['./my-payment-type.component.scss']
})
export class MyPaymentTypeComponent implements OnInit {

  cards: Array<PaymentCard>;
  addCardShow: boolean;

  constructor(
    private modalCtrl: ModalController,
    private paymentCardService: PaymentCardService,
    private stripeService: StripeService
  ) {
    this.stripeService.reloadStripeAccount();
    this.addCardShow = false;
    this.cards = [];
    this.getAllCards();
  }

  ngOnInit(): void {
  }

  getAllCards() {
    this.paymentCardService.getAllPaymentCards().then(data => {
      this.cards = data;
    });
  }

  defineDefault(index) {
    this.paymentCardService.updateDefined(index).then(data => {
      this.cards = data;
    });
  }

  removeCard(index) {
    this.paymentCardService.deletePaymentCard(index).then(data => {
      this.cards = data;
    });
  }

  addCard(name: HTMLInputElement, numberCard: HTMLInputElement, month: HTMLInputElement, year: HTMLInputElement, cvc: HTMLInputElement) {
    this.stripeService.validateCardNumber(numberCard.value)
      .then(() => {
      // TODO : Valide card
      })
      .catch( () => {
        // TODO: do something if error
      });
    const type = this.paymentCardService.checkType(numberCard.value);

    this.paymentCardService.addPaymentCard({
      name: name.value,
      cvc: cvc.value,
      default: true,
      expMonth: parseInt(month.value, null),
      number: numberCard.value,
      type: '' + type,
      expYear: parseInt(year.value, null)
    })
    .then(data => {
      this.cards = data;
      this.addCardShow = false;
    });
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }

}
