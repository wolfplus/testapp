import {Component, OnInit, ViewChild} from '@angular/core';
import {ClubService} from '../shared/services/club/club.service';
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';
import {Observable, Subscription} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {Club} from '../shared/models/club';
import { TranslateService } from '@ngx-translate/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { User } from '../shared/models/user';
import {EnvironmentService} from "../shared/services/environment/environment.service";
import { ClubSearchParam, SearchType } from '../shared/enums/search-type';

@Component({
    selector: 'app-search-club',
    templateUrl: './search-club.page.html',
    styleUrls: ['./search-club.page.scss'],
})
export class SearchClubPage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    clubs: Club[];
    user: User;
    searchParam: string;
    subscriptionClub$: Subscription;
    searchParamType: ClubSearchParam;
    skeletonShow: boolean;
    filters: Observable<any>;
    title$ = this.translate.get('find_a_complex');
    clubsAreLoaded = false;
    clubsLoadingError = false;
    hasNext: boolean;
    nextPage: any;
    env;
    SearchType = SearchType;

    constructor(
        private clubService: ClubService,
        public store: Store<AppState>,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private environmentService: EnvironmentService
    ) {
        this.env = this.environmentService.getEnvFile();
    }

    ngOnInit() {
        if (this.route.snapshot.queryParams.city !== undefined) {
            this.searchParamType = ClubSearchParam.CITY;
            this.searchParam = this.route.snapshot.queryParams.city;
        }
        this.store.select("user")
            .subscribe( user => {
                if (user) {
                    this.user = user;
                }
                this.load();
            });
    }

    reloadClub(reset = false, nextPage = null) {
        if (this.clubsAreLoaded || (!this.clubsAreLoaded && this.clubsLoadingError)) {
            /* if (reset) {
                this.skeletonShow = true;
                this.clubs = [];
            } */
            if (this.subscriptionClub$) {
                this.subscriptionClub$.unsubscribe();
            }
            this.load(nextPage, reset);
        }
    }

    returnRequest(nextPage): Observable<Club[]> {
        if (this.env.useMb) {
            return this.clubService.searchClub(10, false, this.env.marqueBlanche.clubIds);
        } else if (nextPage) {
            return this.clubService.searchClubNext(nextPage);
        } else {
            return this.clubService.searchClub(10, true);
        }
    }

    load(nextPage?, reset?) {
        this.skeletonShow = true;
        this.clubsAreLoaded = false;
        this.clubsLoadingError = false;
        if (reset) {
            this.skeletonShow = true;
            this.clubs = [];
        }

        this.subscriptionClub$ = this.returnRequest(nextPage)
            .subscribe(data => {
                if (data) {
                    if (data['hydra:member']) {
                        if (nextPage) {
                            this.clubs = [...this.clubs, ...data['hydra:member']];
                        } else {
                            this.clubs = data['hydra:member'];
                        }
                        this.clubs = this.clubs.map( club => {
                            if (this.user !== undefined) {
                                club.isPreferred = this.clubIsPreferred(this.user, club['@id']);
                            }
                            return club;
                        });
                        this.clubsAreLoaded = true;
                        this.clubsLoadingError = false;
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
                    } else {
                        this.clubsAreLoaded = false;
                        this.clubsLoadingError = true;
                    }
                } else {
                    this.clubs = [];
                    this.clubsAreLoaded = true;
                    this.clubsLoadingError = true;
                }
                this.skeletonShow = false;
            });

        /* TODO: delete parameter just for testing */
    }

    clubIsPreferred(user, clubIRI) {
        let isPreferred = false;
        if (user && user.preferredClubs.length > 0 && user.preferredClubs.includes(clubIRI)) {
          isPreferred = true;
        }
        return isPreferred;
    }

    loadMoreData() {
        this.reloadClub(false, this.nextPage);
    }
}
