import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {toArray} from 'rxjs/operators';
import {NavigationEnd, NavigationError, Router, RoutesRecognized} from '@angular/router';
import {Platform} from '@ionic/angular';
import { NotificationService } from 'src/app/shared/services/messages/notification.service';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import { ClubService } from 'src/app/shared/services/club/club.service';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent implements OnInit {
  isIphoneX = false;
  env = this.environmentService.getEnvFile();
  dataUrl = 'assets/app-menu.json';
  public data: any;
  displayTabBar: boolean;
  clubId: any;
  notificationCounter$: Observable<number>;
  clubDetails: any;

  constructor(
      private http: HttpClient,
      private router: Router,
      private platform: Platform,
      private notificationService: NotificationService,
      private environmentService: EnvironmentService,
      private clubIdStorageService: ClubIdStorageService,
      private clubService: ClubService
  ) {
    this.env = this.environmentService.getEnvFile();
    if (environmentService.overwriteMatchEvent()) {
      this.data = this.http.get<any>('assets/app-menu-stage.json').pipe(toArray());
    }
  }


  async ngOnInit() {
    await this.clubIdStorageService.getClubId().then(data => {
      this.clubId = data;

      this.http.get<any>(this.dataUrl).pipe(toArray()).subscribe(
          (response) => {
            this.data = response;
            this.clubService.getClub(
                this.clubId == null ? this.environmentService.getEnvFile().marqueBlanche.clubIds[0] : this.clubId
            ).subscribe((club) => {
                  this.clubDetails = club;
                  this.initialization();
                }
            );
          });
    });
  }

  initialization() {
    // Fix for Iphone
    const ratio = window.devicePixelRatio;
    const screen = {
      width : window.screen.width * ratio,
      height : window.screen.height * ratio
    };

    this.notificationCounter$ = this.notificationService.counter$; // .pipe(shareReplay())

    if (this.platform.is('ios') &&
        (
            (screen.width === 1125 && screen.height === 2436) ||
            (screen.width === 750 && screen.height === 1334) ||
            (screen.width === 828 && screen.height === 1792) ||
            (screen.width === 1170 && screen.height === 2532) ||
            (screen.width === 1242 && screen.height === 2688) ||
            (screen.width === 1242 && screen.height === 2208)
        )
    ) {
      this.isIphoneX = true;
    }

    this.router.events.subscribe( (event) => {

      if (event instanceof RoutesRecognized) {
        if (
            (event.url === '/account/informations') ||
            (event.url === '/account/my-activities') ||
            (event.url === '/account/my-friends') ||
            (event.url === '/account/my-subscriptions') ||
            (event.url === '/account/my-clubs') ||
            (event.url === '/account/my-credits') ||
            (event.url === '/account/my-wallet') ||
            (event.url === '/account/my-bookings') ||
            (event.url === '/account/my-matches') ||
            (event.url === '/account/my-payment-type') ||
            (event.url === '/account/params')
        ) {
          this.displayTabBar = false;
        } else {
          this.displayTabBar = true;
        }
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
      }
    });
    this.displayTabBar = true;
  }

  isActive(link: string) {
    if (!this.env.useMb) {
      return this.router.isActive(link, true);
    } else {
      return this.router.isActive(link, false);
    }
  }

  gotToModal(menu) {
    switch (menu.link) {
      case '/friend':
        //this.goToFriend(menu);
        break;
    }
  }
  
  // goToShop(menu) {
  //   // this.modalService.presentShop(this.clubDetails.id, this.clubDetails.name);
  // }

  async goToBookingList() {
    this.clubId = await this.clubIdStorageService.getClubId();
    if (this.env.useMb) {
      this.router.navigate(['select-booking'],
        {
          queryParams:
          {
            name: this.environmentService.getEnvFile().marqueBlanche.nameMb,
            guid: this.clubId
            }
        }
      )
      .then();
    } else {
      this.router.navigate(['/search-club'])
        .then();
    }
  }
}
