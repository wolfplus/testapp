import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {IonInfiniteScroll, ModalController} from '@ionic/angular';
import { AccountService } from '../../../shared/services/account/account.service';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import {select, Store} from "@ngrx/store";
import {getClubCurrency, getCurrentClubId} from "../../../club/store";
import {ClubState} from "../../../club/store/club.reducers";
import {Subject, Subscription} from "rxjs";


@Component({
  selector: 'app-my-wallets-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  wallet: any;
  walletDetails: any;
  clubCurrencySub: Subscription;
  clubCurrency: any;
  lastTransactions: any[] = [];
  pathUrl: string;
  showHistory = false;
  nextPage = null;
  env;
  showSkeleton = true;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
      private modalCtrl: ModalController,
      private environmentService: EnvironmentService,
      private accountService: AccountService,
      private clubStore: Store<ClubState>,
  ) {
      this.clubCurrencySub = this.clubStore.pipe(
          select(getClubCurrency),
          tap(currency => this.clubCurrency = currency)
      ).subscribe();
    this.env = this.environmentService.getEnvFile();
    this.pathUrl = environmentService.getEnvFile().pathFiles;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.clubStore.pipe(
        takeUntil(this.ngUnsubscribe),
        select(getCurrentClubId),
        switchMap((id) => this.accountService.getWalletByClubId(id)),
        filter((data) => data !== undefined),
        map(data => data['hydra:member']),
        filter((data) => (data as Array<any>).length > 0),
        map((data) => data[0]),
        switchMap((wallet) => {
          if (this.environmentService.getEnvFile().useMb) this.wallet = wallet;
          return this.accountService.getWalletDetails(wallet.client.split('/')[3]);
        }),
        tap(walletDetail => {
          this.walletDetails = walletDetail['hydra:member'];
          if (walletDetail['hydra:view']['hydra:next']) {
              this.nextPage = walletDetail['hydra:view']['hydra:next'];
          }
          for (let i = 0; i < 3; i++) {
            const detail = this.walletDetails[i];
            console.log(detail);
              if (detail) {
                this.lastTransactions.push(detail);
              }
          }
          this.showSkeleton = false;
        })
      ).subscribe();
  }

  close() {
      if (this.showHistory === true) {
          this.showHistory = false;
      } else {
          this.modalCtrl.dismiss({refresh: true});
      }
  }

  showHistoricWallet() {
      this.showHistory = true;
  }

  loadMoreData() {
      this.accountService.getWalletDetails(null, this.nextPage).pipe(
          takeUntil(this.ngUnsubscribe),
          tap(walletDetail => {
              this.nextPage = null;
              walletDetail['hydra:member'].forEach(wDet => {
                  this.walletDetails.push(wDet);
              });
              if (walletDetail['hydra:view']['hydra:next']) {
                  this.nextPage = walletDetail['hydra:view']['hydra:next'];
              }
              this.infiniteScroll.complete();
              if (!this.nextPage) {
                  this.infiniteScroll.disabled = true;
              }

          })
      ).subscribe();
  }
}
