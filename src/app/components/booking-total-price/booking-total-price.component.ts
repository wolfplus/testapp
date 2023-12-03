import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-total-price',
  templateUrl: './booking-total-price.component.html',
  styleUrls: ['./booking-total-price.component.scss'],
})
export class BookingTotalPriceComponent implements OnInit {

  totalPrice: number;
  devise: string;
  constructor() {
    this.totalPrice = 0;
    this.devise = '€';
  }

  ngOnInit() {}

}
