import { ModalController, Platform } from '@ionic/angular';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IItem } from '../../state/cart.state';
import { PaymentCard } from 'src/app/shared/models/payment-card';
import { CardComponent } from 'src/app/components/payments/card/card.component';
import { WalletComponent } from 'src/app/components/payments/wallet/wallet.component';
import { Wallet } from 'src/app/shared/models/wallet';
import { Payment } from 'src/app/shared/models/payment';
import { PaymentCardService } from 'src/app/shared/services/storage/payment-card.service';
import { User } from 'src/app/shared/models/user';
import {ClientClub} from "../../../shared/models/client-club";


@Component({
  selector: 'app-shop-confirm',
  templateUrl: './shop-confirm.component.html',
  styleUrls: ['./shop-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopConfirmComponent implements OnInit {


  @Input() items: IItem[];
  @Input() clubCurrency: string;
  @Input() totalPrice: string;
  @Input() client: ClientClub;
  @Input() user: User;

  @Output() triggerPaymentData = new EventEmitter<any>();
  @Output() updatePaymentEvent = new EventEmitter<any>();
  @Output() creditCardSelectedEvent = new EventEmitter();

  withCredit = false;
  withWallet = false;
  wallet: Wallet;
  cards: Array<PaymentCard>;
  noWallet = false;
  selectedCreditCard: any;
  defaultCard: PaymentCard;
  restToPay: number;
  payments: Array<Payment> = [];

  card: any;

  constructor(
    private modalCtr: ModalController,
    private paymentCardService: PaymentCardService,
    public platform: Platform,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.restToPay = parseInt(this.totalPrice, 10);
    this.items.forEach((element) => {
      if (element['item']['walletRefill'] != null) {
        this.noWallet = true;
      }
    });
    this.getAllCards();
  }

  getTotalPriceToString() {
    return parseInt(this.totalPrice, 10);
  }

  getAllCards() {
    this.paymentCardService.getAllPaymentCards()
      .then(data => {
        if (data) {
          this.cards = data;
          this.selectedCreditCard = this.cards.find(card => card.default === true);
          this.creditCardSelectedEvent.emit(this.selectedCreditCard);
          this.triggerPaymentData.emit(true);
          this.cd.markForCheck();
        }
      });
  }

  updatePayment() {
    this.updatePaymentEvent.emit(this.payments);
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
          this.creditCardSelectedEvent.emit(this.selectedCreditCard);
          this.triggerPaymentData.emit(true);
        }
      });
    });
  }

  presentWalletModal() {
    return this.modalCtr.create({
      component: WalletComponent,
      componentProps: {
        currency: this.clubCurrency,
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
        if (data.data !== undefined && data.data.wallet) {
          this.validUseWallet(data.data.wallet);
          this.triggerPaymentData.emit(true);
        }
      });
    });
  }

  validUseWallet(_event: any) {
    this.withWallet = true;
    const amount = parseInt(this.totalPrice, 10);
    // if (this.client.wallet.overdraftAuthorized > (this.client.wallet.balance - this.restToPay)) {
    //   amount = this.client.wallet.balance - this.client.wallet.overdraftAuthorized;
    // }

    const payment: Payment = {
      amount,
      client: this.client['@id'],
      cart: null,
      currency: this.clubCurrency,
      method: 'card',
      provider: 'wallet',
      userClient: this.user['@id']
    };
    this.payments.push(payment);
    this.cd.markForCheck();
    this.restToPay -= amount;
    this.updatePayment();
  }

  removePayment(index: number) {
    if (this.payments[index].provider === 'wallet') {
      this.withWallet = false;
   }
    this.payments.splice(index, 1);
    this.restToPay = parseInt(this.totalPrice, 10);
    this.updatePayment();
    this.cd.markForCheck();
  }

  paymentData(event) {
    this.triggerPaymentData.emit(event);
  }

}
