import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { AccountService } from '../../shared/services/account/account.service';

import {EnvironmentService} from "../../shared/services/environment/environment.service";
import { DetailsConsumptionComponent } from './details/details.component';
import { filter, map, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { Subscription } from 'rxjs';
import { getClubCurrency } from 'src/app/club/store';

@Component({
  selector: 'app-my-consumption',
  templateUrl: './my-consumption.component.html',
  styleUrls: ['./my-consumption.component.scss']
})
export class MyConsumptionComponent implements OnInit {
  env;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  hasNext: boolean;

  consumptions: Array<any>;

  hasLoaded: boolean;

  currency: any;

  nextPage: any;

  clubCurrencySub: Subscription;
  clubCurrency: string;

  constructor(
    private modalCtrl: ModalController,
    private accountService: AccountService,
    private environmentService: EnvironmentService,
    private clubStore: Store<ClubState>
  ) {
    this.env = this.environmentService.getEnvFile();
    this.consumptions  = [];
    this.hasNext = false;
    this.hasLoaded = false;
  }

  ngOnInit() {
    this.load();
  }
  load(nextPage = null) {

    this.clubCurrencySub = this.clubStore.pipe(
      select(getClubCurrency),
      tap(currency => this.clubCurrency = currency)
    ).subscribe();


    this.loadData(nextPage)
      .pipe(
        filter(tmpData0 => {
          this.hasLoaded = true;
          return tmpData0["hydra:member"].length !== 0;
        }),
        map(tmpData1 => {
          if (tmpData1["hydra:view"] && tmpData1["hydra:view"]["hydra:next"]) {
            this.hasNext = true;
            this.nextPage = tmpData1["hydra:view"]["hydra:next"];
            if (this.infiniteScroll) {
              this.infiniteScroll.complete();
              this.infiniteScroll.disabled = false;
            }
          } else {
            this.hasNext = false;
            if (this.infiniteScroll) {
              this.infiniteScroll.complete();
              this.infiniteScroll.disabled = true;
            }
          }
          return tmpData1["hydra:member"];
        }),
        map(tmpData2 => {
          const newData = [];
          tmpData2.forEach(element => {
            newData.push({...element, occurredAtMonthYear: `${new Date(element.occurredAt).toLocaleString('fr-fr', { month: 'long' })}  ${new Date(element.occurredAt).getFullYear().toString().substr(-2)}`})
          });
          return newData;
        }),
        map(tmpData3 => {
          var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
              (rv[x[key]] = rv[x[key]] || []).push(x);
              return rv;
            }, {});
          };
          const groupedData = groupBy(tmpData3, 'occurredAtMonthYear');
          const finalData = [];
          Object.keys(groupedData).map(function (key) {
            finalData.push({date: key, consumptions: groupedData[key]});
          });
          return finalData;
        })
      )
      .subscribe(
        res => {
          if (nextPage) {
            res.map(data => {
              const indexOfEl = this.consumptions.findIndex(el => el.date === data.date);
              if (indexOfEl !== -1) {
                data.consumptions.map(el => {
                  this.consumptions[indexOfEl].consumptions.push(el);
                });
              } else {
                this.consumptions.push(data);
              }
            });
          } else {
            this.consumptions = res;
          }
        }
      );
  }

  goToDetails(c) {
    this.modalCtrl.create({
      component: DetailsConsumptionComponent,
      cssClass: 'my-component-open-class',
      componentProps: {
        saleId: c.id
      }
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss().then( async () => {

      });
    });
  }

  loadData(nextPage) {
    if (nextPage) {
      return this.accountService.getConsumptionNextPage(nextPage);
    } else {
        return this.accountService.getConsumption(this.env.marqueBlanche.whiteLabelId);
    }
  }

  loadMoreData() {
    this.load(this.nextPage);
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }
}
