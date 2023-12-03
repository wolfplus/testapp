import { Component, Input, OnInit } from '@angular/core';
import { StripeService } from '../../../shared/services/payment/stripe.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ModalController } from '@ionic/angular';
import { PaymentCard } from 'src/app/shared/models/payment-card';
import { PaymentCardService } from 'src/app/shared/services/storage/payment-card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cards: Array<PaymentCard> = [];
  errorCard = false;
  errorMonth = false;
  errorYear = false;
  errorCVC = false;
  showAllCards: boolean;

  constructor(
    private paymentCardService: PaymentCardService,
    private stripeService: StripeService,
    private toastService: ToastService,
    private modalCtlr: ModalController
  ) {
    this.stripeService.reloadStripeAccount();
    // this.cards = [];
    this.showAllCards = true;
    // this.getAllCards();
  }

  ngOnInit(): void {
  }

  showAll() {
    this.showAllCards = true;
  }

  defineDefault(index) {
    /* if (this.showAllCards) {
      this.showAllCards = false;
      this.pmService.updateDefined(index).then(data => {
        this.cards = data;
      });
    } */
    this.paymentCardService.updateDefined(index).then(data => {
      this.cards = data;
      this.modalCtlr.dismiss({selectedCard: this.cards[index]});
    });
  }

  addCard(name: HTMLInputElement, numberCard: HTMLInputElement, month: HTMLInputElement, year: HTMLInputElement, cvc: HTMLInputElement) {
    if (name.value === '' ||
        numberCard.value === '' ||
        month.value === '' ||
        year.value === '' ||
        cvc.value === ''
    ) {
      this.toastService.presentError('form_credit_card_invalid', 'top');
      return;
    }

    if(this.errorCard || this.errorMonth || this.errorYear || this.errorCVC) {
      return;
    }

    const type = this.paymentCardService.checkType(numberCard.value);
    this.paymentCardService.addPaymentCard({
      name: name.value,
      cvc: cvc.value,
      default: true,
      expMonth: parseInt(month.value, null),
      number: numberCard.value,
      type: '' + type,
      expYear: parseInt(year.value, null)
    }).then(data => {
      this.cards = data;
    });
  }

  removeCard(index) {
    this.paymentCardService.deletePaymentCard(index).then(data => {
      this.cards = data;
    });
  }

  check(event, type) {
    if (isNaN(event.target.value)) {
      event.target.value = event.target.value.replace(/\D/g, '');
    }
    switch(type) {
      case 0:
        // tslint:disable-next-line:variable-name
        const validateCardNumber = (number: any) => {
          const regex = new RegExp("^[0-9]{13,19}$");
          if (!regex.test(number)){
            return false;
          }

          return luhnCheck(number);
        };

        const luhnCheck = val => {
          let checksum = 0;
          let j = 1;

          for (let i = val.length - 1; i >= 0; i--) {
            let calc = 0;
            calc = Number(val.charAt(i)) * j;

            if (calc > 9) {
              checksum = checksum + 1;
              calc = calc - 10;
            }

            checksum = checksum + calc;

            if (j === 1) {
              j = 2;
            } else {
              j = 1;
            }
          }

          return (checksum % 10) === 0;
        };

        if(event.target.value.length === 16) {
          this.errorCard = !validateCardNumber(event.target.value);
        } else if (event.target.value.length > 16) {
          event.target.value = event.target.value.slice(0, -1);
        }

        break;
      case 1:
        if (event.target.value.length > 2) {
          event.target.value = event.target.value.slice(0, -1);
        }
        const regexMonth = /^(0[1-9]|1[0-2])$/;
        if (regexMonth.test(event.target.value)) {
          this.errorMonth = false;
        } else {
          this.errorMonth = true;
        }
        break;
      case 2:
        if (event.target.value.length > 2) {
          event.target.value = event.target.value.slice(0, -1);
        }
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);

        if (Number(event.target.value) >= Number(year)) {
          this.errorYear = false;
        } else {
          this.errorYear = true;
        }
        break;
      case 3:
        if (event.target.value.length > 3) {
          event.target.value = event.target.value.slice(0, -1);
        }
        break;
    }
  }

  back() {
    this.modalCtlr.dismiss({}).then(() => {});
  }

}
