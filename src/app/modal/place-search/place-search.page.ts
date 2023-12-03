import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { AppState } from '../../state/app.state';
import * as ValidatedSearchActions from '../../state/actions/validated-search.actions';
import { ClubService } from '../../shared/services/club/club.service';
import { Club } from '../../shared/models/club';
import { SearchType } from 'src/app/shared/enums/search-type';
import {Preferences} from '@capacitor/preferences';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { RecentPlaceSearch, SearchTarget } from 'src/app/shared/models/geolocation';
import { ColorStyle, FontSize } from 'src/app/shared/models/style';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.page.html',
  styleUrls: ['./place-search.page.scss'],
})
export class PlaceSearchPage implements OnInit, AfterViewInit {
  @Input() searchType: SearchType;

  title$ = this.translate.get('to_search');

  search: string;
  // searchClubByNameResult$: Observable<Club[] | Club[][]>;
  searchClubByNameResult: Club[];
  // searchClubCitiesResult$: Observable<string[]>;
  searchClubCitiesResult: string[];
  recentPlaceSearch: RecentPlaceSearch;
  ColorStyle = ColorStyle;
  FontSize = FontSize;
  
  searchInput: string;

  skeletonShow: boolean;
  skeletonShowClub: boolean;
  skeletonShowRecent: boolean;
  skeletonShowCities: boolean;

  aroundMeIcon = '<svg xmlns=\'http://www.w3.org/2000/svg\' class=\'ionicon\' viewBox=\'0 0 512 512\'><title>Locate</title><path fill=\'none\' stroke=\'currentColor\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'48\' d=\'M256 96V56M256 456v-40\'/><path d=\'M256 112a144 144 0 10144 144 144 144 0 00-144-144z\' fill=\'none\' stroke=\'currentColor\' stroke-miterlimit=\'10\' stroke-width=\'32\'/><path fill=\'none\' stroke=\'currentColor\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'48\' d=\'M416 256h40M56 256h40\'/></svg>';
  pinIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="42.103" height="50.682" viewBox="0 0 42.103 50.682"><defs><style>.inner-icon{fill:none;stroke:#707070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3.5px;}</style></defs><g transform="translate(1.75 1.75)"><path class="inner-icon" d="M43.1,20.8c0,15.012-19.3,27.88-19.3,27.88S4.5,35.814,4.5,20.8a19.3,19.3,0,1,1,38.6,0Z" transform="translate(-4.5 -1.5)"/><path class="inner-icon" d="M30.893,19.2a8.7,8.7,0,1,1-8.7-8.7A8.7,8.7,0,0,1,30.893,19.2Z" transform="translate(-2.895 0.67)"/></g></svg>';

  noRecentSearchMessage = "";
  noClubMessage = "";
  noCityMessage = "";
  loadComplete = false;
  showGeolocSPinner = false;
  displayGeolocErrorMessage = false;
  showRecentSearch = true;

  constructor(
      private platform: Platform,
      public translate: TranslateService,
      private clubService: ClubService,
      private store: Store<AppState>,
      private modalCtrl: ModalController,
      private geolocationService: GeolocationService,
      private alertCtrl: AlertController,
  ) {
    this.skeletonShow = true;
    this.skeletonShowClub = true;
    this.skeletonShowRecent = true;
    this.skeletonShowCities = true;
  }

  ngOnInit() {
    /* TODO: make sure to delete after test */
    // Storage.clear();

    // this.loadCity();
    this.loadLastSearch();
    // this.loadClubs();
    this.store.pipe(
      select('search'),
      tap( search => {
        if (search.length < 2) {
          this.searchInput = "";
          this.showRecentSearch = true;
          this.searchClubCitiesResult = [];
          this.searchClubByNameResult = [];
          this.noCityMessage = "";
          this.noClubMessage = "";
        }
      }),
      filter(Boolean),
      filter((searchString: string) => searchString.length > 2),
      tap( search => {
        this.showRecentSearch = false;
        this.searchInput = search;
        this.skeletonShowCities = true;
        this.skeletonShowClub = true;
        this.noCityMessage = "";
        this.noClubMessage = "";
      }),
      switchMap( search => {
        return forkJoin(
          [
            this.clubService.searchClubCities(search)
              .pipe(
                map(response => response['items'] !== undefined ? response['items'] : response),
                catchError(error => {
                  return of(console.error("search club by cities error: ", error));
                })
              ),
            this.clubService.searchClubByName(search)
              .pipe(
                map(response => response['hydra:member']),
                catchError(error => {
                  return of(console.error("search club by name error: ", error));
                })
              )
          ]
        );
      }),
      map( stream => {
        return {
          cities: stream[0],
          clubs: stream[1]
        };
      }),
      tap( obj => {
        this.searchClubCitiesResult = obj.cities;
        this.searchClubByNameResult = obj.clubs;
        if (obj.cities.length === 0) {
          this.noCityMessage = this.translate.instant('no_cities-returned');
        } else {
          this.noCityMessage = "";
        }
        this.skeletonShowCities = false;

        if (obj.clubs.length === 0) {
          /* TODO: add translation */
          this.noClubMessage = this.translate.instant('no_club_returned');
        } else {
          this.noClubMessage = "";
        }
        this.skeletonShowClub = false;
      })
    )
    .subscribe();
  }

  ngAfterViewInit() {}

  loadLastSearch() {
    this.platform.ready().then( () => {
      Preferences.get({key: 'RECENT_PLACE_SEARCH'})
        .then( rpc => {
          if (rpc.value !== undefined && rpc.value !== null) {
            this.recentPlaceSearch = JSON.parse(rpc.value);
            this.skeletonShowRecent = false;
             /* TODO: add translation */
          } else {
            this.noRecentSearchMessage = this.translate.instant('no_recent_search_message');
            this.recentPlaceSearch = null;
            this.skeletonShowRecent = false;
          }
        });
    });
  }

  searchAroundMe() {
    this.loadComplete = false;
    this.showGeolocSPinner = true;
    this.displayGeolocErrorMessage = false;

    this.geolocationService.getCurrentPosition()
      .then( () => {
        // this.geolocationService.destroy();
        setTimeout( () => {
          // this.showGeolocSPinner = false;
          // TODO: delete
          // this.store.dispatch(new ValidatedSearchActions.AddValidatedSearch(AROUND_ME));
          this.modalCtrl.dismiss({searchType: this.searchType});
          this.loadComplete = true;
        }, 200);
      })
      .catch( error => {
        // this.geolocationService.destroy();
        setTimeout( () => {
          // this.showGeolocSPinner = false;
          console.error("YO GEOLOC ERROR: ", error);
          this.presentAlert(error);
          this.displayGeolocErrorMessage = true;
          // TODO: delete
          this.loadComplete = true;
        }, 200);
      });
  }

  selectCityAndSearchClub(city: string, alreadyStored = false) {
    this.store.dispatch(new ValidatedSearchActions.AddValidatedSearch(city.toLowerCase()));

    if (!alreadyStored) {
      this.updateRecentSearchStorageObject(SearchTarget.CITY, city);
    }
    this.modalCtrl.dismiss({searchType: this.searchType});
    // this.router.navigate(['/search-club'],{queryParams: {city}})
  }

  goToClub(club) {
    /* TODO: delete if not working / delete imports too */
    this.updateRecentSearchStorageObject('club', club);
    // this.store.dispatch(new ValidatedSearchActions.AddValidatedSearch(club.name.toLowerCase()));
    // this.clubStore.dispatch(ClubActions.loadClub({clubId: club.id}));
    if (this.searchType === SearchType.MATCH) {
      this.modalCtrl.dismiss({clubId: club.id, selectedView: 'matchs'});
    } else {
      this.modalCtrl.dismiss({clubId: club.id, selectedView: 'informations'});
    }
    // this.modalService.showClub(clubId); TODO : add show club in onDissmiss
  }

  updateRecentSearchStorageObject(searchTarget: string, property) {
    // Keep last 5 at most
    if (searchTarget === SearchTarget.CITY) {
      if ( this.recentPlaceSearch !== null && this.recentPlaceSearch !== undefined) {
        if (this.recentPlaceSearch.cities.length === 5) {
          this.recentPlaceSearch.cities.pop();
        }
        // Add most recent to the beginning of the array
        this.recentPlaceSearch.cities.unshift(property);
        this.recentPlaceSearch.cities = [...new Set(this.recentPlaceSearch.cities)];
      } else {
        this.recentPlaceSearch = {
          cities : [property],
          clubs: []
        };
      }
    } else if (searchTarget === SearchTarget.CLUB) {

      if ( this.recentPlaceSearch !== null && this.recentPlaceSearch !== undefined) {
        if (this.recentPlaceSearch.clubs.length === 5) {
          this.recentPlaceSearch.clubs.pop();
        }
        // Add most recent to the beginning of the array
        if (!(this.recentPlaceSearch.clubs.find( club => club.id === property.id))) {
          this.recentPlaceSearch.clubs.unshift(property);
          this.recentPlaceSearch.clubs = [...new Set(this.recentPlaceSearch.clubs)];
        }
      } else {
        this.recentPlaceSearch = {
          cities : [],
          clubs: [property]
        };
      }
    }
    Preferences.set({key: 'RECENT_PLACE_SEARCH', value: JSON.stringify(this.recentPlaceSearch)}).then(() =>  true);
  }

  async presentAlert(message) {
    const alert = await this.alertCtrl.create({
      cssClass: 'do-alert',
      header: message.title,
      message: message.text,
      buttons: [this.translate.instant('undertstood')]
    });

    await alert.present();
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

}
