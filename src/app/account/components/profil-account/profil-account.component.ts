import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatchService } from '../../../matches/match.service';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import { User } from 'src/app/shared/models/user';
import { Period } from 'src/app/shared/enums/period';
import { MyActivitiesComponent } from '../../my-activities/my-activities.component';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {getCurrentMe} from "../../store";
import {tap} from "rxjs/operators";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-profil-account',
  templateUrl: './profil-account.component.html',
  styleUrls: ['./profil-account.component.scss']
})
export class ProfilAccountComponent implements ViewDidEnter, OnInit {
  @Input() userData: any;
  @Output() refreshData = new EventEmitter<boolean>();
  @Input() bookings:any;
  @Input() nextBookings:any;
  @Input() pastBookings:any;
  env;

  MatchCardConfig = MatchCardConfig;
  levels: Array<any>;
  matchs: Array<any> = [];
  events: Array<any>;
  players: Array<any>;
  playedClubs: Array<any>;
  user: User;
  refreshSub$ = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshSub$.asObservable();
  refreshMatchesSub$ = new BehaviorSubject<boolean>(true);
  refreshMatches$ = this.refreshMatchesSub$.asObservable();
  userSubscription$: Subscription;
  showMatchCardsSkeleton: boolean;
  displayNoBooking = false;
  displayNoMatch = false;
  clubIds: any;
  userMe: any;
  clubId:any;
  skeletonBookings = false;

  constructor(
      private matchService: MatchService,
      private modalCtrl: ModalController,
      private environmentService: EnvironmentService,
      private accountStore: Store<any>,
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit() {
    this.getMatches();
  }

  ionViewDidEnter() {
    this.getMatches();
  }

  async getMatches() {
    this.matchs = [];
    this.showMatchCardsSkeleton = false;
      this.accountStore.select(getCurrentMe).pipe(tap(async resp => {
            this.userMe = resp;
            this.user = resp;
        if (this.userMe) {
              await this.matchService.getMyMatches(this.userMe['id'], false, Period.NEXT, 5).subscribe(
                  matchs => {
                    if (matchs != undefined) {
                      this.matchs = matchs;
                    }
                    this.showMatchCardsSkeleton = true;
                  }
              );
            } else {
              this.showMatchCardsSkeleton = true;
            }
          })).subscribe();
  }

  setGradient(colors) {
    return {
      background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
      'background-repeat': 'no-repeat',
      opacity: '.8'
    };
  }

  updateMatches(event) {
    if (event === true) {
      this.refreshMatchesSub$.next(true);
    }
  }

  updateBookingsDisplay(event) {
    if (event === true) {
      this.displayNoBooking = true;
    } else {
      this.displayNoBooking = false;
    }
  }

  updateMatchsDisplay(event) {
    if (event === true) {
      this.displayNoMatch = true;
    } else {
      this.displayNoMatch = false;
    }
  }

  goToUserActivities() {
    // TODO: implement redirection
    this.modalCtrl.create({
      component: MyActivitiesComponent
    })
        .then(modal => {
          modal.present().then();
          modal.onDidDismiss().then(data => {
            if (data.data !== undefined && data.data.refresh) {
              this.refreshData.emit(true);
            }
          });
        });

  }

  getEvent() {
    this.events = [];

  }

  getPlayers() {
    this.players = [{}, {}, {}];

  }

  getPlayedClub() {
    this.playedClubs = [];

  }

}
