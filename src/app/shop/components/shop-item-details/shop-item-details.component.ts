import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ShopItem } from 'src/app/shared/models/shop-item';
import { DomSanitizer } from '@angular/platform-browser';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {ModalController} from "@ionic/angular";
import {SignComponent} from "../../../modal/auth/sign/sign.component";
import {tap} from "rxjs/operators";
import {getCurrentMe} from "../../../account/store";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-shop-item-details',
  templateUrl: './shop-item-details.component.html',
  styleUrls: ['./shop-item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopItemDetailsComponent implements OnInit {

  @Input() item: ShopItem;
  @Input() clubCurrency: string;
  @Input() clubPhotoUrl: string;
  @Input() totalItems: number;
  @Output() clickOnAddItemToCard = new EventEmitter<any>();
  @Output() clickOnRemoveItemFromCard = new EventEmitter<any>();
  env;

  @Input() toGift: boolean;

  constructor(public sanitizer: DomSanitizer,
              private envService: EnvironmentService,
              private accountStore: Store<any>,
              private modalCtrl: ModalController              
  ) {
    this.env = this.envService.getEnvFile();
  }

  ngOnInit(): void {
    this.toGift = false;
  }

  addToCart() {
    this.accountStore.select(getCurrentMe).pipe(tap(data => {
      if(data == undefined) {
        this.modalCtrl
            .create({
              component: SignComponent,
              cssClass: 'sign-class'
            })
            .then(mod => {
              mod.present().then();
            });
      } else {
        this.totalItems++;
        this.clickOnAddItemToCard.emit(this.toGift);
      }
    })).subscribe();
  }

  removeFromCart() {
    if (this.totalItems > 0) {
      this.totalItems--;
      this.clickOnRemoveItemFromCard.emit();
    }
  }

}
