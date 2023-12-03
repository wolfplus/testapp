import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {ActivityService} from "../shared/services/activity/activity.service";
import {EnvironmentService} from "../shared/services/environment/environment.service";
import {Filter} from "../shared/models/filter";
import * as FilterActions from "../state/actions/filter.actions";
import {Store} from "@ngrx/store";
import {AppState} from "../state/app.state";
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap, filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-choices-activities',
  templateUrl: './choices-activities.component.html',
  styleUrls: ['./choices-activities.component.scss']
})
export class ChoicesActivitiesComponent implements OnInit, OnDestroy {
  public activities$: Observable<Array<any>> = null;
  categoryBookId: any;
  clubId: any;
  from: string;
  pathFiles: string;
  isLoaded = false;
  countActivities: number = 0;

  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
      private store: Store<AppState>,
      private route: ActivatedRoute,
      private activityService: ActivityService,
      private router: Router,
      private environmentService: EnvironmentService
  ) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.router.events
        .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
        .subscribe((events: RoutesRecognized[]) => {
          console.log(events, "events <====")
        });
    this.activities$ = this.route.queryParams.pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap((params) => {
        this.pathFiles = this.environmentService.getEnvFile().pathFiles;
        this.from = params["from"];
        this.clubId = params["clubId"];
        this.categoryBookId = params["categoryBookId"];
        console.log("from", params["from"]);
        console.log("clubId", params["clubId"]);
        console.log("categoryBookId", params["categoryBookId"]);

        return this.activityService.getActivitiesByCategory(this.categoryBookId, this.clubId);
      }),
      tap((activities: Array<any>) => {
        console.log("activities", activities);
        if (activities) {
          this.router.events
              .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
              .subscribe((events: RoutesRecognized[]) => {
                console.log(events, "events <====")
                if((events[0].urlAfterRedirects.includes('/select-booking') || events[0].urlAfterRedirects.includes('/booking-group-selection')) && events[1].urlAfterRedirects.includes("choices-activities") && activities.length === 1) {
                  this.router.navigate(['home']);
                }
                /* else {
                  console.log(this.from, "thisfrom <===")
                  if (activities.length === 1 && this.from !== 'sport') {
                    this.showPrestations(activities[0]);
                  } else if (activities.length === 1 && this.from === 'sport') {
                    this.showPlanning(activities[0]);
                  }
                }*/
              });
          this.countActivities = activities.length;
        }

        this.isLoaded = true;
      })
    );
    // .subscribe(params => {
    //   this.pathFiles = this.environmentService.getEnvFile().pathFiles;
    //   this.from = params["from"];
    //   this.clubId = params["clubId"];
    //   this.categoryBookId = JSON.parse(params["categoryBookId"]);
    //   this.activityService.getActivitiesByCategory(this.categoryBookId, this.clubId).subscribe(activities => {
    //     if (activities.length === 1 && this.from !== 'sport') {
    //       this.activities = activities;
    //       this.showPrestations(activities[0]);
    //     } else if (activities.length === 1 && this.from === 'sport') {
    //       this.activities = activities;
    //       this.showPlanning(activities[0]);
    //     } else {
    //       this.activities = activities;
    //     }
    //     this.isLoaded = true;
    //   });
    // });
  }

  actionChoice(activity) {
    if (this.from === 'sport') {
      this.showPlanning(activity);
    } else {
      this.showPrestations(activity);
    }
  }

  showPlanning(activity) {
    const filter: Filter = <Filter>{
      keyFilter: 'ACTIVITY',
      value: activity.id,
      label: activity.name,
      category: 'PLAYGROUND'
    };
    this.store.dispatch(new FilterActions.ClearFilters());
    this.store.dispatch(new FilterActions.Addfilter(filter));

    this.router.navigate(['select-booking'], {
      queryParams: {
        guid: JSON.stringify(this.clubId),
        name: null,
        from: this.from,
        activitySelectedId: JSON.stringify(activity.id),
        categoryId: JSON.stringify(this.categoryBookId)
      }
    });
  }

  showPrestations(activity) {
    console.log(activity, "ça passe ici <====")
    this.router.navigate(['choices-prestations'], {
      queryParams: {
        countActivities: this.countActivities,
        clubId: this.clubId,
        activitySelectedId: activity.id,
        categorySelectedId: this.categoryBookId,
        from: this.from
      }
    });
  }

  backAction() {
    console.log("go to home");
    this.router.navigate(['home']);
  }


}
