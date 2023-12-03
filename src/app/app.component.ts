import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import {Router, NavigationEnd} from '@angular/router';
import { Platform, ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Keyboard } from '@capacitor/keyboard'
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { slideInAnimation } from './route-animation';
import { AuthService } from './shared/services/user/auth.service';
import { GeolocationService } from './shared/services/geolocation/geolocation.service';
import { UserService } from './shared/services/storage/user.service';
import {switchMap, take, takeUntil, tap} from 'rxjs/operators';
import * as moment from 'moment';
import * as SelectedDateActions from './state/actions/selectedDate.actions';
import { OneSignalServiceService } from './shared/services/oneSignal/one-signal-service.service';
import { NotificationService } from './shared/services/messages/notification.service';
import { LocaleService } from './shared/services/translate/locale.service';
import { ClubService } from './club/club.service';
import { from, Observable, Subject, Subscription } from 'rxjs';
import { ClubActions } from './club/store/actions';
import * as AccountActions from './account/store/account.actions';
import { EnvironmentService } from './shared/services/environment/environment.service';
import { ClubState } from './club/store/club.reducers';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import {UpdateAppModalComponent} from "./modal/update-app-modal/update-app-modal.component";
import {HttpClient} from "@angular/common/http";
import {MyBookingsComponent} from "./account/my-bookings/my-bookings.component";
import { User } from './shared/models/user';
import { BranchIo } from '@awesome-cordova-plugins/branch-io/ngx';
import {ClubIdStorageService} from "./shared/services/clud-id-storage/club-id-storage.service";
import {ErrorDisplayService} from "./shared/helpers/error-display.service";

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [slideInAnimation],
  providers: [BranchIo]
})
export class AppComponent implements AfterViewInit, OnInit, AfterViewInit, OnDestroy {
  activePageTitle = 'Dashboard';
  selectedIndex = 1;
  appPages = [];
  dataUrl = 'assets/app-menu.json';
  usedMB: 'lamaisondusquash';
  env;
  useSidemenu = true;
  isHome = false;
  errorSubscription: Subscription;
  showErrorComponent: boolean = false;

  accountMe$: Observable<User> = null;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
      private http: HttpClient,
      private platform: Platform,
      private authService: AuthService,
      public appStore: Store<AppState>,
      private geolocationService: GeolocationService,
      private userService: UserService,
      private oneSignalService: OneSignalServiceService,
      private store: Store<AppState>,
      private notificationService: NotificationService,
      private localeService: LocaleService,
      private clubStore: Store<ClubState>,
      private accountStore: Store<any>,
      private clubService: ClubService,
      public clubIdStorageService: ClubIdStorageService,
      private environmentService: EnvironmentService,
      private modalController: ModalController,
      private router: Router,
      private gtmService: GoogleTagManagerService,
      private branch: BranchIo,
      private errorDisplayService: ErrorDisplayService
  ) {

    Keyboard.setAccessoryBarVisible({isVisible: true})

    this.env = environmentService.getEnvFile();
    if (this.env.useMb) {
      this.setCludId().then(() => {
        this.initializeApp();
      });
    } else {
      this.initializeApp();
    }

    this.errorSubscription = this.errorDisplayService.errorComponent$.subscribe(
        show => {
          this.showErrorComponent = show;
        }
    );

    if(this.env.marqueBlanche.whiteLabelId === "52b36ed5-49e0-4ff3-9540-98470d34fefd") {
      this.router.events.forEach(item => {
        if (item instanceof NavigationEnd) {
          const gtmTag = {
            event: 'page',
            pageName: item.url
          };

          this.gtmService.pushTag(gtmTag);
        }
      });
    }

    this.accountMe$ = this.store.select('user').pipe(
      takeUntil(this.ngUnsubscribe),
    );
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? this.isHome = event.url === "/home" || event.url === "/" : null
    })
    this.loadMenu();

    window.addEventListener("languagechange", (event) => {
      console.log("languagechange event detected!", event);
    });

    Preferences.get({key: 'locale'}).then(async data => {
      console.log(data.value, "ici ???")
      if (data.value) {
        this.localeService.setLanguage(data.value);
      } else {
        this.localeService.setLanguage(await this.localeService.getDeviceLocale());
      }
    });

    // BranchIo
    this.platform.resume.subscribe(() => {
      branchInit();
    });

    const branchInit = () => {
      this.branch.initSession()
        .then(data => {
          alert('Deep Link Data: ' + JSON.stringify(data));

          if (data['+clicked_branch_link']) {
            switch (data['target_type']) {
              case 'match':
                console.log(data, "y a le match <====================")
                break;
              case 'newUser':
                //
                break;
              case 'select-booking':
                //
                break;
              case 'LoginPage':
                //
                break;
              case 'web-link':
                window.open(data['target_id'], "system", 'location=yes');
                break;
            }
          }
        })
        .catch(error => console.log("Branch init ERROR: ", error));
    };
  }

  checkMenuSelected() {
    const path = window.location.pathname.split('/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title?.toLowerCase() === path?.toLowerCase());
    }
  }

  loadMenu() {
    this.http.get<any>(this.dataUrl).pipe(tap(response => {
      this.appPages = response.menu;
      this.checkMenuSelected();
    })).subscribe();
  }

  ngAfterViewInit() {
  }

  // Peut servir si la pop-up dechoix de club serait enlever
  setCludId() {
    return Preferences.get({key: "clubId"}).then(value => {
      if (value.value) {
        if (this.environmentService.getEnvFile().marqueBlanche.clubIds.includes(value.value)) {
          return this.setClubStorageDefault(value.value);
        } else {
          return this.setClubStorageDefault(this.environmentService.getEnvFile().marqueBlanche.clubIds[0]);
        }
      }

      return this.setClubStorageDefault(this.environmentService.getEnvFile().marqueBlanche.clubIds[0]).then();
    }).catch(err => {
      console.log(err);
    });
  }

  async setClubStorageDefault(clubId: string) {
    await this.clubStore.dispatch(ClubActions.loadClub({clubId}));
    Preferences.set({key: 'clubId', value: clubId}).then(() => true);
  }

  initializeApp() {
    this.loadTagManager();
    this.env = this.environmentService.getEnvFile();
    SplashScreen.show().then();
    this.platform.ready()
      .then(() => {
        try {
          if ((this.platform.is('ios') || this.platform.is('android')) && !this.platform.is('mobileweb')) {
            this.oneSignalService.initOneSignal();
          }
        } catch (e) {
          console.log('error init OneSignal : ', e.stack, e.message);
        }

        if (this.platform.is('desktop') === false) {
          if (this.platform.is('ios')) {
            //StatusBar.hide();
            StatusBar.setOverlaysWebView({ overlay: true }).then();
          } else {
            StatusBar.setOverlaysWebView({ overlay: false }).then();
          }
          StatusBar.setStyle({ style: Style.Light }).then();
  
          if (this.platform.is("hybrid")) {
  
            //StatusBar.setBackgroundColor({ color: '#FFFFFF' }).then();
  
            SplashScreen.hide().then();
  
            this.oneSignalService.initOneSignal();
  
            /*this.branch.getFirstReferringParams()
              .then(data => {
                console.log('this.branch.getFirstReferringParams() - data : ', data);
              })
              .catch(err => {
                console.log('this.branch.getFirstReferringParams() - data - ERROR : ', err);
              });*/
  
          }
        }
        
        this.getUserLocation();
        this.getLoggedUser();

        /*this.appStore.pipe(
          select("validatedSearch"),
          take(1)
        )
          .pipe(
          tap(search => {
            if (search === "") {
              Storage.get({key: 'RECENT_PLACE_SEARCH'})
                  .then(rpc => {
                    if (rpc.value !== undefined && rpc.value !== null) {
                      const recentPlaceSearch = JSON.parse(rpc.value);
                      if (recentPlaceSearch !== undefined && recentPlaceSearch.cities && recentPlaceSearch.cities.length) {
                        this.appStore.dispatch(new ValidatedSearchActions.AddValidatedSearch(recentPlaceSearch.cities[0].toLowerCase()));
                      }
                    }
                  });
              }
            })
          )
          .subscribe();*/
      });

    this.clubService.appNeedUpdate(this.env.marqueBlanche.clubIds[0]).subscribe(data => {
      const whiteLabelInfo = data;
      if (whiteLabelInfo) {
        const strLastVersionApp: string = whiteLabelInfo.appVersion ? whiteLabelInfo.appVersion : '0';
        const lastVersionApp = strLastVersionApp.split('.');
        const  envVersionApp = this.env.versionApp.split('.');
        let numberLastVersion = '';
        lastVersionApp.forEach(nb => {
          numberLastVersion = numberLastVersion + nb;
        });
        let numberEnvVersion = '';
        envVersionApp.forEach(nb => {
          numberEnvVersion = numberEnvVersion + nb;
        });
        if (numberEnvVersion < numberLastVersion) {
          if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
            this.modalController.create({
              component: UpdateAppModalComponent,
              cssClass: 'sign-class',
              componentProps: {
                androidUrl: whiteLabelInfo.googleAppLink,
                appleUrl: whiteLabelInfo.appleAppLink
              },
              backdropDismiss: false,
              animated: true
            }).then(modal => {
              modal.onDidDismiss();
              modal.present();
            });
          }
        }
      }
    });

    // ### Set date to store
    const date = moment().minute(0).hour(0).second(0).millisecond(0).utc(true);
    this.store.dispatch(new SelectedDateActions.AddSelectedDate(date));

    setTimeout(_ => {
      this.notificationService.getAllNotifications()
        .pipe(
          take(1)
        )
        .subscribe();
    }, 1000);

  }

  async getLoggedUser() {
    const clubId = await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
    this.authService.getConnectedUser(clubId)
      .pipe(
        tap(async data => {
          if (!data) {
            this.authService.logout();
          } else {
            console.log(data, "le data au début <===")
            await this.accountStore.dispatch(AccountActions.setMe({ data }));
          }
        })
      )
      .subscribe();
  }

  getUser() {
    this.userService.get()
      .subscribe();
  }

  getUserLocation() {
    /* TODO: delete parameter just for testing */
    this.geolocationService.getCurrentPosition("APP_COMPONENT").catch((reason) => console.warn(reason));
  }

  getClubInformation() {
    this.clubService.getClub(this.env.marqueBlanche.clubIds[0]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      club => this.store.dispatch(ClubActions.loadClubSuccess({ club }))
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadTagManager() {
    if (this.environmentService.isPasserelle() && this.environmentService.isThisMB('urbanroundnet')) {
      const script1 = document.createElement("script");
      script1.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KVM6F2D');
          `;
      document.head.appendChild(script1);
      const script2 = document.createElement("noscript");
      script2.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KVM6F2D" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.appendChild(script2);
    }
  }

  showMyBookings() {
    this.accountMe$.pipe(
      takeUntil(this.ngUnsubscribe),
      take(1),
      switchMap((user: User) => from(this.modalController.create({
        component: MyBookingsComponent,
        cssClass: 'my-component-open-class',
        componentProps: {
          userId: user.id
        }
      })))
    ).subscribe((modal: HTMLIonModalElement) =>  {
      modal.present().then();
      modal.onDidDismiss();
    });
  }

}

