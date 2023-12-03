import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { StripeService } from 'src/app/shared/services/payment/stripe.service';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent implements OnInit {

  card: any;
  @Output() paymentData = new EventEmitter<any>();

  constructor(private stripeService: StripeService) {
    this.stripeService.reloadStripeAccount();
  }

  ngOnInit(): void {
    this.setupStripe();
  }

  setupStripe() {
    const elements = this.stripeService.getStripe().elements();
    const style = {
      base: {
        width: '100%',
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { hidePostalCode: true, style });
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      const displayError = document.getElementById('card-error');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
      this.paymentData.emit(event.complete);
      if (event.complete === true && event.error === undefined) {
        this.stripeService.setCard(this.card);
      }
      if (event.complete === false && event.error !== undefined) {
        this.stripeService.setCard(undefined);
      }
    });

  }

}
