import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountService } from '../../shared/services/account/account.service';

import { filter, map, tap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { DetailsComponent } from './details/details.component';
import {select, Store} from "@ngrx/store";
import {getCurrentClubId} from "../../club/store";
import {ClubState} from "../../club/store/club.reducers";

@Component({
  selector: 'app-my-wallets',
  templateUrl: './my-wallets.component.html',
  styleUrls: ['./my-wallets.component.scss']
})
export class MyWalletsComponent implements OnInit {
  wallets: Array<any> = [];
  pathUrl: string;
  env;
  showSkeleton = false;

  /* TODO: add this to 'content_wallets' in translation:
   Sélectionne un porte-monnaie pour le recharger ou consulter tes transactions.
  Select a wallet to reload it or see your transaction history.
  */

  constructor(
      private modalCtrl: ModalController,
      private accountService: AccountService,
      private clubStore: Store<ClubState>,
      private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.pathUrl = environmentService.getEnvFile().pathFiles;
  }

  ngOnInit(): void {
    this.showSkeleton = true;
    this.accountService.getWallets()
      .pipe(
        tap( () => this.showSkeleton = false),
        filter( data => data !== undefined),
        map( dataMap => dataMap['hydra:member']),
        tap( wallets => {
          if (this.environmentService.getEnvFile().useMb) {


            this.clubStore.pipe(
                select(getCurrentClubId),
                tap(clubId => {
                  const matchingWallets = wallets.filter( wallet => wallet.club['@id'] === '/clubs/' + clubId);
                  this.wallets = [...this.wallets, ...matchingWallets];
                })
            ).subscribe();
          }
        })
      )
      .subscribe();
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }

  goToDetails(wallet) {
    this.modalCtrl.create({
      component: DetailsComponent,
      componentProps: {
        wallet: wallet
      }
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss().then( data => {
        if(data.data.refresh) {
          this.showSkeleton = true;
          this.wallets = [];
          this.accountService.getWallets()
          .pipe(
            tap( () => this.showSkeleton = false),
            filter( filter => filter !== undefined),
            map( dataMap => dataMap['hydra:member']),
            tap( wallets => {
              if (this.environmentService.getEnvFile().useMb) {
                this.clubStore.pipe(
                    select(getCurrentClubId),
                    tap(clubId => {
                      const matchingWallets = wallets.filter( wallet => wallet.club['@id'] === '/clubs/' + clubId);
                      this.wallets = [...this.wallets, ...matchingWallets];
                    })
                ).subscribe();
              }
            })
          )
          .subscribe();
        }
      });
    });
  }
}
