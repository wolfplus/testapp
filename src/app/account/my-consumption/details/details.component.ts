import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountService } from '../../../shared/services/account/account.service';

import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { map, tap } from 'rxjs/operators';
import { getClubCurrency } from 'src/app/club/store';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsConsumptionComponent implements OnInit {

  @Input() saleId;

  env;
  consumptionDetail: any;

  groupedProductsByTaxValue: any[];

  clubCurrencySub: Subscription;
  clubCurrency: string;

  constructor(
    private modalCtrl: ModalController,
    private accountService: AccountService,
    private environmentService: EnvironmentService,
    private clubStore: Store<ClubState>,
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit(): void {
    this.load();
  }

  load() {

    this.clubCurrencySub = this.clubStore.pipe(
      select(getClubCurrency),
      tap(currency => this.clubCurrency = currency)
    ).subscribe();

    this.accountService.getConsumptionDetails(this.saleId)
    .pipe(
      map(data => {
        const groupBy = (xs, key) =>
        {
            return xs.reduce((rv, x) => {
              (rv[x[key]] = rv[x[key]] || []).push(x);
              return rv;
            }, {});
          };
        const groupedData = groupBy(data.products, 'taxValue');
        const tmpData = [];
        Object.keys(groupedData).map((key) => {
          const sumTaxAmount: number = groupedData[key].map(a => a.taxAmount).reduce((a, b) => {
            return a + b;
          });
          const sumPriceByTaxAmount: number = groupedData[key].map(a => a.price).reduce((a, b) => {
            return a + b;
          });
          tmpData.push({taxValue: key, sumTaxAmount, sumPriceByTaxAmount});
        });
        this.groupedProductsByTaxValue = tmpData;
        return data;
      })
    )
    .subscribe(res => {
      this.consumptionDetail = {
        id: res["id"],
        number: res["number"],
        amount: res["amount"],
        taxAmount: res["taxAmount"],
        company: res["company"],
        billFooter: res["billFooter"],
        vatNumber: res["vatNumber"],
        address: res["address"],
        occurredAt: res["occurredAt"],
        products: res["products"],
        payments: res["payments"],
        status: res["status"]
      };
    });
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }
}
