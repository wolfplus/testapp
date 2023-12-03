import { Component, ChangeDetectionStrategy, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shop-categories',
  templateUrl: './shop-categories.component.html',
  styleUrls: ['./shop-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopCategoriesComponent implements OnChanges {
  @Input() categories: Array<any>;
  @Output() clickOnCategorieEvent = new EventEmitter<any>();
  constructor() { }

  ngOnChanges() {
    this.categories.sort((x, y) => x.name.localeCompare(y.name));
  }

  clickOnCategorie(index) {
    this.clickOnCategorieEvent.emit(index);
  }

}
