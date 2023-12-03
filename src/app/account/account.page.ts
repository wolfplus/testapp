import {Component} from '@angular/core';
import {AuthService} from '../shared/services/user/auth.service';
import {NavController} from '@ionic/angular';
import {AccountService} from '../shared/services/account/account.service';
import {BehaviorSubject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {filter, take, tap} from 'rxjs/operators';
import { BookingService } from '../shared/services/booking/booking.service';
import { ClubIdStorageService } from '../shared/services/clud-id-storage/club-id-storage.service';
import { Period } from 'src/app/shared/enums/period';
import {getCurrentClub} from "../club/store";
import {select, Store} from "@ngrx/store";
import {ClubState} from "../club/store/club.reducers";
import {getCurrentMe} from "./store";
import {EnvironmentService} from "../shared/services/environment/environment.service";
import * as AccountActions from "./store/account.actions";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {

  selectedTab: string;
  userDataSub$ = new BehaviorSubject({});
  userData$ = this.userDataSub$.asObservable();
  userData = null;
  refreshBooking = false;
  refreshLevelsView: boolean;
  bookings: any;
  clubId: any;
  nextBookings: any;
  pastBookings: any;
  userMe: any;
  isLoaded = false;

  club: any;
  refreshLevelsViewSub$ = new BehaviorSubject<boolean>(false);
  refreshLevelsView$ = this.refreshLevelsViewSub$.asObservable();

  constructor(
    private authService: AuthService,
    private nav: NavController,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private clubIdStorageService: ClubIdStorageService,
    private clubStore: Store<ClubState>,
    private accountStore: Store<any>,
    public environmentService: EnvironmentService,
  ) { }


  async ionViewDidEnter() {
    this.isLoaded = false;
    this.selectedTab = 'PROFIL';
    if (this.route.snapshot.queryParams.view) {
      this.selectedTab = this.route.snapshot.queryParams.view.toUpperCase();
    }


    this.clubId = await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
    await this.accountStore.select(getCurrentMe).pipe(tap(async data => {

      this.userMe = data;
      this.getDataUserClient();

      if (this.userMe) {
        await this.clubStore.pipe(select(getCurrentClub), tap(async club => {
          if (club && club.id) {
            this.club = club;
            this.nextBookings = [];
            this.pastBookings = [];
            this.bookings = [];

            const isAllin = this.environmentService.getEnvFile().marqueBlanche.clubIds[0] === '18c52639-e8e9-4f98-b2fa-9189d81fe5d1';

            this.nextBookings = await this.bookingService.getMyBookings(this.club, false, Period.NEXT, 5, this.clubId, this.userMe['id'], "ASC", isAllin).toPromise();
            this.nextBookings = this.nextBookings['hydra:member'];

            this.pastBookings = await this.bookingService.getMyBookings(this.club, false, Period.PAST, 5, this.clubId, this.userMe['id'], "DESC", isAllin).toPromise();
            this.pastBookings = this.pastBookings['hydra:member'];

            if (this.nextBookings !== undefined && this.nextBookings.length) {
              this.bookings = [...this.nextBookings];
            } else if (this.pastBookings !== undefined && this.pastBookings.length && this.nextBookings.length === 0) {
              this.bookings = [...this.pastBookings];
            }

            this.bookings.sort((a, b) => {
              return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
            });
          }
        })).subscribe();
      }
    })).subscribe();
  }

  async getDataUserClient() {
    if (this.userMe) {
      // this.userData = await this.accountService.getDataUserClient(this.userMe.id).toPromise();
      await this.accountService.getDataUserClient(this.userMe.id).pipe(tap(data => {
        this.userData = data;
        this.userDataSub$.next(this.userData);
        this.isLoaded = true;
      })).subscribe();
    }
  }

  changeTab(event) {
    this.selectedTab = event;
  }

  refreshLevels() {
    // this.refreshLevelsViewSub$.next(true);
    this.accountService.getDataUserClient(this.userData['id'])
      .pipe(
        take(1),
        filter(data => data !== undefined),
        tap(data => this.userData = data),
        tap( (data) => this.userDataSub$.next(data))
      )
      .subscribe();
  }

  logout() {
    this.nav.navigateRoot('/home').then(async () => {
      this.authService.logout();
      await this.accountStore.dispatch(AccountActions.removeMe(null));
    });
  }

}
