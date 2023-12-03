import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { MatchService } from '../../matches/match.service';
import { User } from '../../shared/models/user';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Period } from 'src/app/shared/enums/period';
import { Observable, Subscription } from 'rxjs';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import * as SortEvents from 'src/app/shared/helpers/sort-events-by-date';

import {EnvironmentService} from "../../shared/services/environment/environment.service";

@Component({
  selector: 'app-my-matches',
  templateUrl: './my-matches.component.html',
  styleUrls: ['./my-matches.component.scss']
})
export class MyMatchesComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  env;
  MatchCardConfig = MatchCardConfig;
  data: Array<any>;
  selectedView: string;
  user: User;
  userLocation$: Observable<any>;
  displayErrorMessage: boolean;
  hasNext: boolean;
  nextPage: string;
  pastMatches = [];
  yesterdayMatches = [];
  todayMatches = [];
  tomorrowMatches = [];
  otherDaysMatches = [];
  matches = [];
  displayNoMatchMessage: boolean;
  showSkeleton: boolean;
  otherDaysMatchesByDate: any;
  pastMatchesByDate: any;
  subscription$: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private matchService: MatchService,
    // private geolocationService: GeolocationService,
    private store: Store<AppState>,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.selectedView = 'next';
  }

  ngOnInit(): void {
    // this.userLocation$ = from(this.geolocationService.getCurrentPosition().then(location => {
    //   return location;
    //   // this.userLocation = location;
    // }).catch(() => undefined));
    this.load(this.selectedView);
  }

  segmentChanged(event) {
    this.selectedView = event.detail.value;
    this.load(event.detail.value);
  }

  returnRequest(status: Period, userClient: User, nextPage?){
    if (nextPage) {
      return this.matchService.getMyMatchesNextPage(nextPage);
    } else {
      if (status === 'canceled') {
        return this.matchService.getMyMatches(userClient.id, true, status);
      } else {
        return this.matchService.getMyMatches(userClient.id, false, status);
      }
    }
  }

  load(status, reset = true, nextPage = null ) {
    // TODO: unsubscribe from OBSERVABLES in OnDestroy
    if (reset) {
      this.matches = [];
      this.showSkeleton = true;
    }

    this.subscription$ = this.store.select('user').subscribe(
      async (userClient) => {
        this.user = userClient;
        if (userClient !== null) {
          const data = await this.returnRequest(status, userClient, nextPage).toPromise();
          if (data !== undefined) {
            this.displayErrorMessage = false;
            if (data['hydra:view']['hydra:next']) {
              this.hasNext = true;
              this.nextPage = data['hydra:view']['hydra:next'];
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

            this.pastMatches = [];
            this.pastMatchesByDate = [];
            this.yesterdayMatches = [];
            this.todayMatches = [];
            this.tomorrowMatches = [];
            this.otherDaysMatches = [];
            this.otherDaysMatchesByDate = [];

            if (reset) {
              this.matches = data['hydra:member'];
            } else {
              this.matches = [...this.matches, ...data['hydra:member']];
            }
            if (this.matches.length === 0) {
              this.displayNoMatchMessage = true;
            } else {
              const sorted = SortEvents.byDate(this.matches, status);
              // this.sortByDate(this.matches, Period.CANCELED);
              this.pastMatches = sorted.pastEvents;
              this.pastMatchesByDate = sorted.pastEventsByDate;
              this.yesterdayMatches = sorted.yesterdayEvents;
              this.todayMatches = sorted.todayEvents;
              this.tomorrowMatches = sorted.tomorrowEvents;
              this.otherDaysMatches = sorted.otherDaysEvents;
              this.otherDaysMatchesByDate = sorted.otherDaysEventsByDate;
              this.displayNoMatchMessage = false;
            }
            this.showSkeleton = false;
          } else {
            this.matches = [];
            this.displayErrorMessage = true;
          }

        }
      });
  }

  loadMoreData() {
    this.load(this.selectedView, false, this.nextPage);
  }

  close() {
    this.modalCtrl.dismiss({refresh: true});
  }

  ionViewDidLeave() {
    if (this.subscription$ !== undefined) {
      this.subscription$.unsubscribe();
    }
  }

}
