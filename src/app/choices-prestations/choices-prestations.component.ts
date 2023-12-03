import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EnvironmentService} from "../shared/services/environment/environment.service";
import {select, Store} from "@ngrx/store";
import {AppState} from "../state/app.state";
import {getClubCurrency, getCurrentClub} from "../club/store";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import {ActivityService} from "../shared/services/activity/activity.service";
import {ClubState} from "../club/store/club.reducers";
import { Observable } from 'rxjs/internal/Observable';
import { from, of, Subject } from 'rxjs';

@Component({
    selector: 'app-choices-prestations',
    templateUrl: './choices-prestations.component.html',
    styleUrls: ['./choices-prestations.component.scss']
})
export class ChoicesPrestationsComponent implements OnInit, OnDestroy {

    club: any;
    currentClubId: string;
    activitySelectedId: any;
    from: string;
    categoryId: string;
    // formuleSelected: any;
    clubCurrency$: Observable<string> = null;
    // prestations: Array<any>;
    pathFiles: string;
    countActivities: number = 0;
    defaultImage$: Observable<string> = null;
    isLoaded = false;
    public prestations$: Observable<Array<any>> = null;
    private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private environmentService: EnvironmentService,
        private activityService: ActivityService,
        private clubStore: Store<ClubState>
    ) {
        this.defaultImage$ = this.clubStore.select(getCurrentClub).pipe(
            takeUntil(this.ngUnsubscribe),
            switchMap(club => {
            this.club = club;
            console.log("club", club);

            if (this.club.photos && this.club.photos[0]) {
                return of(this.club.photos[0].contentUrl);
            }
            return of("");
        }));

        this.clubCurrency$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getClubCurrency),
            switchMap(currency => of(currency))
        );
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngOnInit(): void {
        // this.prestations = [];
        this.pathFiles = this.environmentService.getEnvFile().pathFiles;
        this.prestations$ = this.route.queryParams.pipe(
            takeUntil(this.ngUnsubscribe),
            switchMap((params) => {
                
                console.log("from", params["from"]);
                console.log("clubId", params["clubId"]);
                console.log("activitySelectedId", params["activitySelectedId"]);
                console.log("categorySelectedId", params["categorySelectedId"]);
            
                if (params["activitySelectedId"] === null || params["activitySelectedId"] === undefined) {
                    return from([[]]);
                }
                this.from = params["from"];
                this.currentClubId = params["clubId"];
                if (params["activitySelectedId"]) {
                    this.activitySelectedId = params["activitySelectedId"];
                }
                if (params["countActivities"]) {
                    this.countActivities = params["countActivities"];
                }
                if (params["categorySelectedId"]) {
                    this.categoryId = params["categorySelectedId"];
                }
            
                return this.activityService.getPrestations(this.categoryId, this.activitySelectedId, this.currentClubId, this.from);
            }),
            switchMap((prestations: Array<any>) => {
                console.log("prestations", prestations);
                this.isLoaded = true;
                return from([prestations.sort(this.orderPrestaByDuration)]);
            }),
            tap((prestations: Array<any>) => {
                if (prestations.length === 0) {
                    this.router.navigate(['home']);
                }
            }),
        );
        // this.route.queryParams.subscribe(params => {
        //     if (params["activitySelectedId"] === null || params["activitySelectedId"] === undefined) {
        //         return false;
        //     }
        //     this.from = params["from"];
        //     this.currentClubId = JSON.parse(params["clubId"]);
        //     if (params["activitySelectedId"]) {
        //         this.activitySelectedId = JSON.parse(params["activitySelectedId"]);
        //     }
        //     if (params["countActivities"]) {
        //         this.countActivities = params["countActivities"];
        //     }
        //     if (params["categorySelectedId"]) {
        //         this.categoryId = JSON.parse(params["categorySelectedId"]);
        //     }
            
        //     console.log("from", params["from"]);
        //     console.log("clubId", JSON.parse(params["clubId"]));
        //     console.log("activitySelectedId", JSON.parse(params["activitySelectedId"]));
        //     console.log("categorySelectedId", JSON.parse(params["categorySelectedId"]));
            
        //     this.activityService.getPrestations(this.categoryId, this.activitySelectedId, this.currentClubId, this.from)
        //         .subscribe(prestations => {
        //             this.prestations = prestations.sort(this.orderPrestaByDuration);
        //             this.isLoaded = true;
        //         });
            
        //     // if (params["formuleSelected"]) {
        //     //     this.formuleSelected = JSON.parse(params["formuleSelected"]);
        //     //     this.prestations = this.formuleSelected.prestations;
        //     // }
        // });
    }

    showSlots(prestation) {
        this.router.navigate(['booking-group-selection'], {
            queryParams: {
                prestation: JSON.stringify(prestation),
                clubId: this.currentClubId,
                id: 'booking-group-selection',
                from: this.from,
                countActivities: this.countActivities,
                activitySelectedId: this.activitySelectedId,
                categorySelectedId: this.categoryId,
            }
        });
    }

    backAction() {
        if (this.countActivities > 1) {
            this.router.navigate(['choices-activities'], {
                queryParams: {
                    clubId: this.currentClubId,
                    categoryBookId: this.categoryId,
                    from: this.from
                }
            });
        } else {
            this.router.navigate(['home']);
        }
    }

    orderPrestaByDuration(a, b) {
        if (a.duration < b.duration) {
            return -1;
        }
        if (a.duration > b.duration) {
            return 1;
        }
        // a doit être égal à b
        return 0;
    }
}
