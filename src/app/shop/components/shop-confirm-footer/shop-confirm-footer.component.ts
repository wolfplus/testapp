import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Payment } from 'src/app/shared/models/payment';

@Component({
  selector: 'app-shop-confirm-footer',
  templateUrl: './shop-confirm-footer.component.html',
  styleUrls: ['./shop-confirm-footer.component.scss']
})
export class ShopConfirmFooterComponent implements OnChanges {

  @Input() clubCurrency: string;
  @Input() totalPrice: string;
  @Input() payments: Array<Payment> = [];
  @Input() isDisable: boolean;
  @Output() payEvent = new EventEmitter();

  restToPay = 0;

  constructor() { }

  ngOnChanges() {
    this.restToPay = parseInt(this.totalPrice, 10) - this.payments.reduce((prev, cur) => prev + cur.amount, 0);
  }

  pay() {
    this.payEvent.emit();
  }

}
