import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, ModalController} from "@ionic/angular";
import {AccountService} from "../../../shared/services/account/account.service";
import {tap} from "rxjs/operators";
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {ClubState} from "../../../club/store/club.reducers";
import {select, Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {getClubCurrency} from "../../../club/store";

@Component({
  selector: 'app-credit-details',
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.scss']
})
export class CreditDetailsComponent implements OnInit {

  @Input() creditSelected: any;

  clubCurrencySub: Subscription;
  clubCurrency: any;

  historicCreditShort: Array<any>;
  historicCreditAll: Array<any>;

  env;
  pathUrl: string;

  showHistory = false;
  nextPage = null;
  showSkeleton = true;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(private modalCtrl: ModalController,
              private environmentService: EnvironmentService,
              private accountService: AccountService,
              private clubStore: Store<ClubState>) { }

  ngOnInit(): void {
    this.historicCreditShort = [];
    this.clubCurrencySub = this.clubStore.pipe(
        select(getClubCurrency),
        tap(currency => this.clubCurrency = currency)
    ).subscribe();
    this.env = this.environmentService.getEnvFile();
    this.pathUrl = this.environmentService.getEnvFile().pathFiles;
    this.loadCreditDetails();
  }

  loadCreditDetails() {
    return this.accountService.getClientCreditDetail(this.creditSelected.id)
        .pipe(
          tap(creditDet => {
            if (creditDet['hydra:view']['hydra:next']) {
              this.nextPage = creditDet['hydra:view']['hydra:next'];
            }
            if (creditDet['hydra:member']) {
              this.historicCreditAll = creditDet['hydra:member'];
              for (let i = 0; i < 3; i++) {
                if (this.historicCreditAll[i]) {
                  this.historicCreditShort.push(this.historicCreditAll[i]);
                }
              }
            }
            this.showSkeleton = false;
          })
        )
        .subscribe()
  }

  showHistoricCredit() {
    this.showHistory = true;
  }

  loadMoreData() {
    this.accountService.getClientCreditDetail(null, this.nextPage).pipe(
        tap(creditDet => {
          this.nextPage = null;
          creditDet['hydra:member'].forEach(wDet => {
            this.historicCreditAll.push(wDet);
          });
          if (creditDet['hydra:view']['hydra:next']) {
            this.nextPage = creditDet['hydra:view']['hydra:next'];
          }
          this.infiniteScroll.complete();
          if (!this.nextPage) {
            this.infiniteScroll.disabled = true;
          }

        })
    ).subscribe();
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }

}
