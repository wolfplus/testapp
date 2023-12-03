import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shop-footer',
  templateUrl: './shop-footer.component.html',
  styleUrls: ['./shop-footer.component.scss']
})
export class ShopFooterComponent implements OnInit {

  @Input() showDisabledFooter: boolean;
  @Input() totalSameItems: number;
  @Input() totalPriceSameItems: number;
  @Input() priceItem: number;
  @Input() clubCurrency: string;

  @Output() updateCardEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  updateCard() {
    this.updateCardEvent.emit();
  }

}
