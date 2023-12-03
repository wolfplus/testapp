import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountService } from '../../shared/services/account/account.service';
import { UserService } from '../../shared/services/storage/user.service';
import { ClubService } from '../../shared/services/club/club.service';

import {EnvironmentService} from "../../shared/services/environment/environment.service";
import {CreditDetailsComponent} from "./credit-details/credit-details.component";
import { combineLatest, from, Subject } from 'rxjs';
import { filter, finalize, mergeMap, switchMap, takeUntil, tap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-my-credits',
  templateUrl: './my-credits.component.html',
  styleUrls: ['./my-credits.component.scss']
})
export class MyCreditsComponent implements OnInit, OnDestroy {
  env;
  isLoaded = false;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  credits: Array<any>;
  constructor(
    private modalCtrl: ModalController,
    private accountService: AccountService,
    private userService: UserService,
    private clubService: ClubService,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.credits = [];
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    from(Promise.resolve(this.userService.getStoredClients()))
    .pipe(
      takeUntil(this.ngUnsubscribe),
      filter((clients) => clients !== null && clients !== undefined),
      mergeMap(clients => clients as Array<any>),
      switchMap(client => combineLatest([from([client]), this.clubService.get(client.club)])),
      switchMap(([client, club]: any) => combineLatest([from([club]), this.accountService.getClientCredits(client.client.replace('/clubs/clients/', ''))])),
      filter(([_club, data]: any) => data !== undefined),
      tap(([club, data]: any) => {
        console.log("club", club, "data", data);
        const credits = data['hydra:member'];
        if (credits.length > 0) {
          this.credits.push({
            club,
            credits
          });
        } else {
          this.isLoaded = true;
          this.credits = [];
        }
        this.isLoaded = true
      }),
      toArray(),
      finalize(() => {
        console.log("finalize");
        this.isLoaded = true
      })
    ).subscribe();

  }

  seeCreditDetails(credit: any) {
    this.modalCtrl.create({
      component: CreditDetailsComponent,
      componentProps: {
        creditSelected: credit
      }
    }).then(modal => {
        modal.present().then();
        modal.onDidDismiss();
      })
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }
}
