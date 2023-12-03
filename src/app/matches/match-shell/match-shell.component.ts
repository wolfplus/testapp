import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { ModalBaseComponent } from 'src/app/components/modal-base/modal-base.component';
import { ModalContentComponent } from 'src/app/components/modal-content/modal-content.component';
import { AppState } from 'src/app/state/app.state';
import { MatchActions } from '../store';
import { Filter } from 'src/app/shared/models/filter';
import { User } from 'src/app/shared/models/user';
import { SignComponent } from 'src/app/modal/auth/sign/sign.component';
import { ActivatedRoute } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { getClubTimeZone } from 'src/app/club/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { MatchDetailComponent } from '../match-detail/match-detail.component';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import { ClubService } from 'src/app/shared/services/club/club.service';
import { SearchType } from 'src/app/shared/enums/search-type';
import {SignInComponent} from "../../modal/auth/sign-in/sign-in.component";
import {AuthService} from "../../shared/services/user/auth.service";
import {CookieService} from "ngx-cookie-service";
import {LoaderService} from "../../shared/services/loader/loader.service";
import {UserTokenService} from "../../shared/services/storage/user-token.service";

@Component({
  selector: 'app-match-shell',
  templateUrl: './match-shell.component.html',
  styleUrls: ['./match-shell.component.scss'],
  animations: [
    trigger(
      'enterLeave',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('0.5s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('0.5s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class MatchShellComponent implements OnInit, OnDestroy {

  userSubscription$: Subscription;
  user: User;
  matches$: Observable<any>;
  filters$: Observable<any>;
  matchesAreLoaded: boolean;
  isFirstTimeViewEnter = true;
  isLoadingMoreData = false;

  // REFACTO
  selectedDate$: Observable<any>;
  searchFilters$: Observable<Filter[]>;
  filtersSubscription$: Subscription;
  filtersChange$: Observable<any>;
  searchTerm$: Observable<string>;
  validatedSearchTerm$: Observable<string>;
  requestParameters: { selectedDate: any; searchTerm: string; searchFilters: Filter[]; };
  displaySearchRequestError: boolean;
  viewIsActive = true;
  clubTimeZone: string;
  keyCloack;
  clubDetails: any;
  // END OF REFACTO

  SearchType = SearchType;
  
  constructor(
    public store: Store<AppState>,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private route: ActivatedRoute,
    private clubStore: Store<ClubState>,
    public environmentService: EnvironmentService,
    private authService: AuthService,
    private clubIdStorageService: ClubIdStorageService,
    private cookieService: CookieService,
    private clubService: ClubService,
    private userToken: UserTokenService,
    private loaderService: LoaderService,
  ) {
  }

  ngOnInit() {
    this.selectedDate$ = this.store.select('selectedDate');
    this.searchFilters$ = this.store.select('filter');
    this.validatedSearchTerm$ = this.store.select('validatedSearch');
    this.clubStore.select(getClubTimeZone).subscribe(
      clubTimeZone => this.clubTimeZone = clubTimeZone
    );

    this.keyCloack = this.cookieService.get('Token_Keycloak');
    if (this.keyCloack && this.keyCloack !== 'Error') {
      this.loaderService.presentLoading();
      this.authService.signInUserCloack(this.keyCloack).subscribe(
          tokens  => {
            if (tokens) {
              this.userToken.add(tokens).then(() => {
                this.authService.getConnectedUser()
                    .subscribe(() => {
                      this.loaderService.dismiss();
                      this.load();
                    });
              });
            }
          },
          err => console.error(err),
          () => this.loaderService.dismiss()
      );
    } else {
        this.load();
    }
  }

  load() {
      this.userSubscription$ = this.store.pipe(
          select('user'),
      )
          .subscribe(user => {
              this.user = user
              console.log(user, "le user <===")
          });

      this.filtersSubscription$ = combineLatest(
          [
              this.selectedDate$.pipe(
                  debounceTime(500),
                  // distinctUntilChanged()
              ),
              this.validatedSearchTerm$,
              this.searchFilters$.pipe(
                  debounceTime(500),
                  // distinctUntilChanged()
              )
          ]
      )
          .pipe(
              // distinctUntilChanged(),
              map(res => {
                  return {
                      selectedDate: res[0],
                      searchTerm: res[1],
                      searchFilters: res[2],
                      clubIds: (this.environmentService.getEnvFile().useMb ? this.environmentService.getEnvFile().marqueBlanche.clubIds : null),
                      clubTimeZone: this.clubTimeZone
                  };
              }),
              tap(parameters => {
                  this.requestParameters = parameters;
                  if (this.viewIsActive) {
                      this.reloadMatches(true, this.requestParameters);
                  }
              })
          )
          .subscribe();
  }

  ionViewDidLeave() {
    this.viewIsActive = false;
  }

  ngOnDestroy() {
    if (this.userSubscription$ !== undefined) {
      this.userSubscription$.unsubscribe();
    }
    if (this.filtersSubscription$) {
      this.filtersSubscription$.unsubscribe();
    }
  }

  async ionViewDidEnter() {
    const clubsId = await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
    this.clubDetails = await this.clubService.getClub(clubsId).toPromise();

    const params = this.route.snapshot.queryParams;
    if (params && params.matchId && params.activityId) {
      this.presentMatchDetails(params.matchId, params.activityId, true);
    }
    if (!this.isFirstTimeViewEnter) {

      this.resetMatches();
      this.reloadMatches(false, this.requestParameters);
    }
    this.viewIsActive = true;
    this.isLoadingMoreData = false;
    this.isFirstTimeViewEnter = false;
  }


  async presentMatchDetails(matchId: string, matchActivityId: string, isEditable) {
      return await this.modalController
      .create({
        component: this.user ? MatchDetailComponent : SignInComponent,
        cssClass: 'match-details-class',
        componentProps: {
          matchId,
          matchActivityId,
          isEditable,
          routeOpen: true
        },
        animated: true
      })
      .then(modal => {
        modal.present();
        modal.onDidDismiss()
          .then(returnedData => {
            if (returnedData.data) {
              if (returnedData.data['reload'] === true) {
                this.reloadMatches(true, this.requestParameters);
              }
            }
          });
      });
  }

  resetMatches() {
    this.store.dispatch(MatchActions.removeAllMatchs());
    this.store.dispatch(MatchActions.resetHydraView());
  }

  reloadMatches(reset = false, parameters?) {
    if (parameters === undefined) {
      parameters = this.requestParameters;
    }
    this.displaySearchRequestError = false;
    if (reset) {
      this.resetMatches();
    }
    this.store.dispatch(MatchActions.loadMatchs({ parameters }));
  }

  createMatch() {
    if (this.user !== undefined && this.user !== null) {
      this.modalController
        .create({
          presentingElement: this.routerOutlet.nativeEl,
          component: ModalBaseComponent,
          cssClass: 'base-class',
          componentProps: {
            rootPage: ModalContentComponent,
            userId: this.user.id
          },
          animated: true
        })
        .then(modal => {
          modal.onDidDismiss()
            .then( data => {
              if (data.data && data.data.matchCreated !== undefined && data.data.activityId && data.data.matchId) {
                this.presentMatchDetails(data.data.matchId, data.data.activityId, true);
              }
            });
          modal.present();
        });
    } else {
      this.modalController
        .create({
          component: SignComponent,
          cssClass: 'sign-class'
        })
        .then(modal => {
          modal.onDidDismiss();
          modal.present();
        });
    }
  }

  showCalendar() {

  }

}
