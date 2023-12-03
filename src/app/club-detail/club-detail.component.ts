import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Club } from '../shared/models/club';
import { ActivityService } from '../shared/services/activity/activity.service';
import { Activity } from '../shared/models/activity';
import { ModalController } from '@ionic/angular';

import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/storage/user.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { AccountService } from '../shared/services/account/account.service';
import { User } from '../shared/models/user';
import { Geolocation } from '../shared/models/geolocation';
import * as UserActions from '../state/actions/user.actions';
import { SignComponent } from '../modal/auth/sign/sign.component';
import { EnvironmentService } from '../shared/services/environment/environment.service';
import {ClubState} from "../club/store/club.reducers";
import {getCurrentClub} from "../club/store";
import { ColorStyle, FontSize } from '../shared/models/style';

interface ClubDetail {
  club: Club,
  activities: Array<Activity>,
  user: User,
  userPosition?: Geolocation
}

@Component({
  selector: 'app-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.scss'],
})
export class ClubDetailComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() selectedView = "informations";

  env;
  club: Club;
  user: User;
  activities: Array<Activity>;
  path = this.environmentService.getEnvFile().pathFiles;
  isAPreferredClub: boolean;
  clubGeolocSub$ = new BehaviorSubject<{ latitude: number; longitude: number; }>({latitude: null, longitude: null});
  clubLocation$ = this.clubGeolocSub$.asObservable();
  userPositionSub$ = new BehaviorSubject<Geolocation>({latitude: null, longitude: null});
  userLocation$ = this.userPositionSub$.asObservable();
  distance: string;
  clubId: any;
  ColorStyle = ColorStyle;
  FontSize = FontSize;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
      private activityService: ActivityService,
      private modalCtr: ModalController,
      private router: Router,
      private store: Store<AppState>,
      private storeClub: Store<ClubState>,
      private userService: UserService,
      private accountService: AccountService,
      private environmentService: EnvironmentService  ) {
    this.env = environmentService.getEnvFile();
    this.isAPreferredClub = false;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    /// REFACTO
    combineLatest([
      this.storeClub.select(getCurrentClub).pipe(tap( club => {
            this.club = club;
            this.clubGeolocSub$.next({latitude: club.latitude, longitude: club.longitude});
          })
      ),
      this.activityService.getActivities(this.id)
        .pipe(
          filter(activities => activities !== undefined),
          tap( _ => this.activities = []),
          map( activities => activities['hydra:member']),
        ),
      this.userService.get(),
      this.store.select('geolocation')
    ])
    .pipe(
      takeUntil(this.ngUnsubscribe),
      map( stream => {
        return {
          club: stream[0],
          activities: stream[1],
          user: stream[2],
          userPosition: stream[3]
        } as ClubDetail;
      }),
      tap( object => {
        this.activities = object.activities;
        this.user = object.user;
        if (object.userPosition) {
          this.userPositionSub$.next(object.userPosition);
        }
        /* if (this.userPosition) {
          this.distance = LocationDistance.calculateDistance(this.clubGeoloc, this.userPosition);
        } */
        if (this.user) {
          this.isAPreferredClub  = this.isPreferred(this.user, this.club.id);
        }
      })
    )
    .subscribe();
  }

  isPreferred(user, clubIRI) {
    let isPreferred = false;
    if (user && user.preferredClubs.length > 0 && user.preferredClubs.includes(clubIRI)) {
      isPreferred = true;
    }
    return isPreferred;
  }

  changePref() {
    // this.isAPreferredClub = !this.isAPreferredClub;
    if (this.user) {
      const preferredClubs = [...this.user.preferredClubs];
      if (this.isAPreferredClub) {
        const clubIndex = this.user.preferredClubs.findIndex( (club) => club['@id'] === this.club['@id']);
        preferredClubs.splice(clubIndex, 1);
      } else {
        preferredClubs.push(this.club['@id']);
      }
      this.accountService.updateUser({preferredClubs}, this.user.id).pipe(
        take(1),
        tap( user => this.store.dispatch(new UserActions.AddUser(user)))
      )
      .subscribe();
    } else {
      // redirect to connect
      this.presentSignInModal();
    }
  }

  async presentSignInModal() {
    const modalAuthSign = await this.modalCtr.create({
      component: SignComponent,
      cssClass: 'sign-class'
    });
    return await modalAuthSign.present();
  }

  changeView(event) {
    this.selectedView = event;
  }

  bookNow() {
    this.router.navigate(['select-booking'], {queryParams: {name: this.club.name, guid: this.clubId}}).then(() => {
      this.modalCtr.dismiss().then();
    });
  }

  close() {
    this.modalCtr.dismiss().then();
  }

}
