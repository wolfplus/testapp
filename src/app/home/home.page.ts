import {Component, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Platform, ViewDidEnter, ToastController, ModalController} from '@ionic/angular';
import {AuthService} from '../shared/services/user/auth.service';
import {User} from '../shared/models/user';
import {tap} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';
import {EnvironmentService} from '../shared/services/environment/environment.service';
import {ClubIdStorageService} from '../shared/services/clud-id-storage/club-id-storage.service';
import {MySubscriptionsComponent} from '../account/my-subscriptions/my-subscriptions.component';
import {MyCreditsComponent} from '../account/my-credits/my-credits.component';
import {BookingService} from '../shared/services/booking/booking.service';
import {Period} from 'src/app/shared/enums/period';
import {MatchService} from '../matches/match.service';
import {Store} from "@ngrx/store";
import {ClubState} from "../club/store/club.reducers";
import {getCurrentClub} from "../club/store";
import {MyQrCodeComponent} from "./components/my-qr-code/my-qr-code.component";
import {DetailsComponent} from "../account/my-wallets/details/details.component";
import {SponsorsService} from "../shared/services/sponsors/sponsors.service";
import { register } from 'swiper/element/bundle';
import {getCurrentMe} from "../account/store";

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewDidEnter, OnDestroy {
  user: User;
  refreshSub$ = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshSub$.asObservable();
  refreshMatchesSub$ = new BehaviorSubject<boolean>(false);
  resetFormSubject: Subject<boolean> = new Subject<boolean>();
  refreshMatches$ = this.refreshMatchesSub$.asObservable();
  clubs: Array<any> = [];
  slidePhotos: Array<any> = [];
  environnement;
  path = this.environmentService.getEnvFile().pathFiles;
  clubSelected: any = null;
  clubId: any;
  nextBookings: any;
  modalIsOpen: boolean = false;
  Period = Period;
  sponsors: any = [];
  bookings: any;
  pastBookings: any;
  currentPic: any;
  skeletonBookings = false;
  userMe: any;

  titleMatch: any;
  matchs: any;
  noChange = false;

  constructor(
      public translate: TranslateService,
      public authService: AuthService,
      public platform: Platform,
      private bookingService: BookingService,
      public environmentService: EnvironmentService,
      public clubIdStorageService: ClubIdStorageService,
      public toastController: ToastController,
      private modalController: ModalController,
      private matchService: MatchService,
      private sponsorsService: SponsorsService,
      private accountStore: Store<any>,
      private clubStore: Store<ClubState>  ) {
    this.environnement = this.environmentService.getEnvFile();
  }

  async load() {
    console.log(this.accountStore, "son account store stp <===")
    try {
      this.skeletonBookings = true;
      this.clubs = [];

      this.matchs = [];
      if (this.userMe === null || this.userMe === undefined) {
        await this.matchService.getMatches({
          clubIds: this.environmentService.getEnvFile().marqueBlanche.clubIds
        }, false, this.noChange ? null : this.clubId).subscribe(
            (matchs) => {
              if (matchs !== undefined && matchs['hydra:member'].length) {
                this.titleMatch = this.translate.instant('home_page_matches_wl');
                this.matchs = matchs['hydra:member'];
              }
            }
        );
        this.skeletonBookings = false;
      } else {
        await this.matchService.getMyMatches(this.userMe['id'], false, Period.NEXT, null, this.noChange ? null :this.clubId).subscribe(
            async (matchs) => {
              if(matchs['hydra:member'].length > 0) {
                this.titleMatch = (
                    this.environmentService.overwriteMatchEvent() ?
                        this.translate.instant('my_upcoming_stages') :
                        this.translate.instant('my_upcoming_matches')
                );
                this.matchs = matchs['hydra:member'];
              }
              if (matchs['hydra:member'].length === 0) {
                await this.matchService.getMatches({
                  clubIds: this.environmentService.getEnvFile().marqueBlanche.clubIds
                }, false, this.noChange ? null : this.clubId)
                    .subscribe(
                        (matchesSec) => {
                          if (matchesSec['hydra:member'].length > 0) {
                            this.matchs = matchesSec['hydra:member'];
                            this.titleMatch = this.translate.instant('home_page_matches_wl');

                          }
                        }
                    );
              }
            }
        )

        this.nextBookings = [];
        this.pastBookings = [];
        this.bookings = [];

        const isAllin = this.environmentService.getEnvFile().marqueBlanche.clubIds[0] === '18c52639-e8e9-4f98-b2fa-9189d81fe5d1';

        const stream1 = await this.bookingService.getMyBookings(this.clubSelected, false, Period.NEXT, 5, this.clubId, this.userMe['id'], 'ASC', isAllin).toPromise();
        const stream2 = await this.bookingService.getMyBookings(this.clubSelected, false, Period.PAST, 5, this.clubId, this.userMe['id'], 'DESC', isAllin).toPromise();

        if (stream1) {
          this.nextBookings = stream1['hydra:member'];
        }

        if (stream2) {
          this.pastBookings = stream2['hydra:member'];
        }

        if (this.nextBookings !== undefined && this.nextBookings.length) {
          this.bookings = [...this.nextBookings];
        } else if (this.pastBookings !== undefined && this.pastBookings.length && this.nextBookings.length === 0) {
          this.bookings = [...this.pastBookings];
        }

        this.bookings.sort((a, b) => {
          return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
        });

        this.skeletonBookings = false;
      }

    } catch (e) {
      console.log(e);
    }
  }

  async initiateHome() {
    this.clubId = await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
    if (this.environnement.useMb) {
      await this.clubStore.select(getCurrentClub).pipe(tap(club => {
        if (club && club.id) {
          console.log(club, "le club <=== ???")
          this.clubSelected = club;
          this.load();
          this.sponsorsService.getSponsors(club.id).subscribe((sponsors) => {
            if(sponsors && sponsors['hydra:member'].length > 0) {
              this.sponsors = sponsors['hydra:member'].filter((x) => x.photo !== null);
            }
          })
        }
      })).subscribe();
    } else {
      this.load();
    }
  }

  async ionViewDidEnter() {
    await this.accountStore.select(getCurrentMe).pipe(tap(data => {
      this.userMe = data;
      this.initiateHome();
    })).subscribe();
  }

  async refreshClubs(event) {
    if (event.reload === true) {
      this.clubSelected = event.clubSelected;
      this.initiateHome();
    }
  }

  updateMatches(event) {
    if (event === true) {
      this.load();
    }
  }

  viewPic(index) {
    const photos = this.clubSelected.photos;
    const elem = photos[index];
    photos.splice(index, 1);
    photos.splice(0, 0, elem);
    this.slidePhotos = photos;
    this.modalIsOpen = true;
    this.currentPic = 'https://api-v3.doinsport.club/uploads/clubs/photos/padel-rain-6448696d36e5b022471983.jpg';
  }

  onCloseModal() {
    this.modalIsOpen = false;
    this.currentPic = null;
  }

  openSponsor(value) {
    if(value.url) {
      window.open(value.url, "_blank");
    }
  }

  goTo(component) {
    let componentToOpen;
    switch (component) {
      case "MySubscriptionsComponent":
        componentToOpen = MySubscriptionsComponent;
        break;
      case "MyCreditsComponent":
        componentToOpen = MyCreditsComponent;
        break;
      case "MyWalletsComponent":
        componentToOpen = DetailsComponent;
        break;
    }

    this.modalController.create({
      component: componentToOpen
    })
        .then(modal => {
          modal.present().then();
          modal.onDidDismiss().then( () => {
          });
        });
  }

  openQrCode() {
    this.modalController.create({
      component: MyQrCodeComponent,
      cssClass: 'modal-qr-code',
      backdropDismiss: true,
      componentProps: {
        userMe: this.userMe,
        clubId: this.clubId
      }
    }).then(modal => {
      modal.present().then();
      modal.onDidDismiss().then(() => {
      });
    });
  }

  showQrCode() {
    if (['soccertimeguyane'].includes(this.environnement.marqueBlanche.pathName)) {
        return true;
    }
    if (this.clubSelected?.accessControlService?.checkinTypes) {
      return this.clubSelected.accessControlService?.checkinTypes?.findIndex(el => el === 'qrcode') !== -1;
    }
    return false;
  }

  ngOnDestroy() {
    this.refreshSub$.next(false);
    this.resetFormSubject.next(true);
  }

}
