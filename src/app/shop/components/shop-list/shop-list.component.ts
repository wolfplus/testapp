import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ShopItem } from 'src/app/shared/models/shop-item';
import {Store} from "@ngrx/store";
import {AppState} from "../../../state/app.state";
import {Observable} from "rxjs";

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopListComponent implements OnInit {

  public items$: Observable<Array<ShopItem>> | undefined = undefined;
  @Input() clubCurrency: string;
  @Input() description: string;
  @Output() clickOnItemEvent = new EventEmitter<any>();
  @Output() loadMoreData = new EventEmitter<any>();

  skeleton = false;
  constructor(
      private store: Store<AppState>
  ) {}

  clickOnItem(item) {
    this.clickOnItemEvent.emit(item);
  }

  ngOnChange() {
    this.skeleton = false;
  }
  ngOnInit(): void {
    this.items$ = this.store.select('shop');
  }

  loadMoreDataScroll($event) {
    this.loadMoreData.emit($event);
  }
}
