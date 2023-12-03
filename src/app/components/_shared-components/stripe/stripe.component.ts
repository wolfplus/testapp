import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StripeService } from 'src/app/shared/services/payment/stripe.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements OnInit {

  card: any;

  @Input() deleteCard: boolean;

  @Output() paymentData = new EventEmitter<any>();
  @Output() cardName = new EventEmitter<any>();

  userFullName: string;

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
        display: 'flex',
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

    this.card = elements.create('card', {hidePostalCode: true, style});
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      const displayError = document.getElementById('card-error');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
      this.paymentData.emit({valid: event.complete && event.error === undefined});
      if (event.complete === true && event.error === undefined) {
        console.log("this.card in service", this.card);
        this.stripeService.setCard(this.card);
      }
      if (event.complete === false && event.error !== undefined) {
        this.stripeService.setCard(undefined);
      }
    });
  }

  nameChange() {
    this.cardName.emit(this.userFullName);
  }

}
