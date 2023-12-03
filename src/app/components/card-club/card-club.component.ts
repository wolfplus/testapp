import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Club} from '../../shared/models/club';
import {ModalService} from '../../shared/services/modal.service';
import * as LocationDistance from '../../shared/Tools/location-distance';
import {Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';
import {switchMap, take, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

import * as UserActions from '../../state/actions/user.actions';
import {UserService} from '../../shared/services/storage/user.service';
import {AccountService} from '../../shared/services/account/account.service';
import {SignComponent} from '../../modal/auth/sign/sign.component';
import {ModalController} from '@ionic/angular';
import {of} from 'rxjs';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ClubDetailComponent } from 'src/app/club-detail/club-detail.component';

@Component({
  selector: 'app-card-club',
  templateUrl: './card-club.component.html',
  styleUrls: ['./card-club.component.scss'],
})
export class CardClubComponent implements OnInit, AfterViewInit {
  @Input() club: Club;
  pathFiles: string;
  distance: string;
  heartIcon = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1850 1850"><g transform="matrix(1,0,0,-1,37.966102,1343.4237)"><path d="m 896,-128 q -26,0 -44,18 L 228,492 q -10,8 -27.5,26 Q 183,536 145,583.5 107,631 77,681 47,731 23.5,802 0,873 0,940 q 0,220 127,344 127,124 351,124 62,0 126.5,-21.5 64.5,-21.5 120,-58 55.5,-36.5 95.5,-68.5 40,-32 76,-68 36,36 76,68 40,32 95.5,68.5 55.5,36.5 120,58 64.5,21.5 126.5,21.5 224,0 351,-124 127,-124 127,-344 0,-221 -229,-450 L 940,-110 q -18,-18 -44,-18"/></g></svg>';
  heartColor = "white";
  isAPreferredClub: false;

  constructor(
    private modalService: ModalService,
    private store: Store<AppState>,
    private router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private modalCtr: ModalController,
    private environmentService: EnvironmentService
  ) { }

  ngOnInit() {
    this.pathFiles = this.environmentService.getEnvFile().pathFiles;
  }

  ngAfterViewInit() {
    this.store.select('geolocation')
      .pipe(
        tap(data => {
          if (data.longitude !== null && data.latitude !== null) {
            this.distance = parseFloat(LocationDistance.calculateDistance(
              {latitude: this.club.latitude, longitude: this.club.longitude},
              {longitude: data.longitude, latitude: data.latitude}
            ))
            .toFixed(1);
          }
        })
      )
      .toPromise();
  }

  showClub() {
    this.modalService.showClub(ClubDetailComponent, this.club.id).then();
  }

  /* getDistance(geolocClub: Geoloc) {
    let distance = '0';
    const resp = this.store.select('geolocation').pipe(tap(data => {
      distance = LocationDistance.calculateDistance(geolocClub, {longitude: data.longitude, latitude: data.latitude});
    })).toPromise();

    return parseFloat(distance).toFixed(1);
  } */

  actionHeart() {
    this.changePref();
  }

  changePref() {
    this.userService.get().subscribe(user => {
      if (user) {
        const preferredClubs = [...user.preferredClubs];
        if (this.isAPreferredClub) {
          const clubIndex = user.preferredClubs.findIndex( (club) => club['@id'] === this.club['@id']);
          preferredClubs.splice(clubIndex, 1);
        } else {
          preferredClubs.push(this.club['@id']);
        }
        this.accountService.updateUser({preferredClubs}, user.id).pipe(
            take(1),
            tap( userData => this.store.dispatch(new UserActions.AddUser(userData)))
        ).subscribe();
      } else {
        // redirect to connect
        this.presentSignInModal();
      }
    });

    this.userService.get().pipe(switchMap(user => {
      if (user) {
        const preferredClubs = [...user.preferredClubs];
        if (this.isAPreferredClub) {
          const clubIndex = user.preferredClubs.findIndex( (club) => club['@id'] === this.club['@id']);
          preferredClubs.splice(clubIndex, 1);
        } else {
          preferredClubs.push(this.club['@id']);
        }
        return this.accountService.updateUser({preferredClubs}, user.id);
      } else {
        return of('EMPTY');
        // redirect to connect
        this.presentSignInModal();
      }
    }),
    tap(userData => {
      if (userData === 'EMPTY') {
        this.store.dispatch(new UserActions.AddUser(userData));
      }
    })
    );

  }

  async presentSignInModal() {
    const modalAuthSign = await this.modalCtr.create({
      component: SignComponent,
      cssClass: 'sign-class'
    });
    return await modalAuthSign.present();
  }

  showBookingClub() {
    this.router.navigate(['select-booking'], {queryParams: {name: this.club.name, guid: this.club.id}});
  }

  shortZipCode(zipCode: string) {
    if (zipCode !== undefined) {
      return zipCode.substring(0, 2);
    }
    return undefined;
  }
}
