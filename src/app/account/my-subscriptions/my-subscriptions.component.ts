import { Component, OnDestroy, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AccountService} from '../../shared/services/account/account.service';
import {UserService} from '../../shared/services/storage/user.service';
import {ClubService} from '../../shared/services/club/club.service';
import {Club} from '../../shared/models/club';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';

import { BehaviorSubject, combineLatest, from, Subject } from 'rxjs';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import {ListSubscriptionsClubComponent} from "../../modal/list-subscriptions-club/list-subscriptions-club.component";
import { select, Store } from '@ngrx/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import {getCurrentClubId} from "../../club/store";


@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.scss']
})
export class MySubscriptionsComponent implements OnInit, OnDestroy {

  user: User;
  data: Array<{
    club: Club,
    subscriptionCards: Array<any>
  }>;
  selectedView: string;
  selectedViewSub$ = new BehaviorSubject<string>('active');
  selectedView$ = this.selectedViewSub$.asObservable();
  clients: Array<any>;
  pathUrl: string;
  env;
  isLoaded = false;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private accountService: AccountService,
    private userService: UserService,
    private clubService: ClubService,
    private environmentService: EnvironmentService,
    private clubStore: Store<ClubState>,
  ) {
    this.selectedView = 'active';
    this.env = this.environmentService.getEnvFile();
    this.pathUrl = this.environmentService.getEnvFile().pathFiles;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.load();
  }

  segmentChanged(event) {
    this.selectedView = event.detail.value;
    /* TODO: implement filter active / inactive */
    if (event.detail.value === "active") {
      this.load();
    }
  }
  openSubscriptions() {
    this.modalCtrl.create({
      component: ListSubscriptionsClubComponent,
      id: 'modal-list-subscriptions',
      componentProps: {},
      swipeToClose: true,
      backdropDismiss: true,
      mode: 'ios'
    })
      .then(modal => {
        modal.present().then();
        modal.onDidDismiss().then( data => {
          if (data.data) {
            this.load();
          }
        });
      });
  }

  load() {
    this.data = [];
    combineLatest([
      this.userService.get()
      .pipe(
        filter(user => user !== null),
        tap(user => this.user = user),
        switchMap((user) => from([user.id]))
      ),
      this.clubStore.pipe(
        select(getCurrentClubId))
    ]).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap(([usrId, clubId]) => this.accountService.getMyClientsByClubId(usrId, clubId)),
      filter(data => data !== undefined),
      map( data => data['hydra:member']),
      tap((data) => {
        if (data === null || (data as Array<any>).length === 0) {
          this.isLoaded = true;
          this.data = [];
        }
      }),
      filter(data => data !== undefined && (data as Array<any>).length > 0),
      tap((data) => console.log("data", data)),
      switchMap((data) => combineLatest([from([data[0]]), this.clubService.get(data[0].club)])),
      filter(([client, club]: any) => club !== undefined && client !== undefined),
      tap(([client, club]: any) => console.log("client", client, "club", club)),
      switchMap(([client, club]: any) => combineLatest([from([client]), from([{
        club,
        subscriptionCards: []
      }])])),
      tap(([client, dataSubCard]: any) => {
        console.log("client", client, "dataSubCard", dataSubCard);
        if (client.subscriptionCardsAvailable) {
          client.subscriptionCardsAvailable.forEach(item => {
            this.accountService.getSuscriptionCards(item['@id'])
              .pipe(
                takeUntil(this.ngUnsubscribe),
                filter(subCard => subCard !== undefined),
                tap( subCard => dataSubCard.subscriptionCards.push(subCard))
              )
              .subscribe();
          });
          console.log("push", dataSubCard);
          this.data.push(dataSubCard);
        }
        this.isLoaded = true;
      })
    ).subscribe();

  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }
}
