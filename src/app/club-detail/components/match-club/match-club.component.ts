import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import {MatchService} from '../../../matches/match.service';
import * as moment from 'moment';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Filter, FiltersConfig } from 'src/app/shared/models/filter';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';

import { ClubMatch } from 'src/app/matches/match.model';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";

@Component({
  selector: 'app-match-club',
  templateUrl: './match-club.component.html',
  styleUrls: ['./match-club.component.scss']
})
export class MatchClubComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Input() clubId: string;
  @Input() userId: string;
  env;
  MatchCardConfig = MatchCardConfig;
  matches: Array<ClubMatch>;
  date: string;
  selectedDate$: Observable<any>;
  searchFilters$: Observable<Filter[]>;
  clubId$: Observable<string>;
  filtersSubscription$: Subscription;
  requestParameters: { clubId: string; selectedDate: any; searchFilters: Filter[]; };
  matchesAreLoaded = false;
  matchesAreLoading = false;
  matchesLoadingError: string;
  hasNext: boolean;
  nextPage: string;
  isLoadingMoreData: boolean;
  showSkeleton: boolean;
  displayNoMatchMessage: boolean;
  displayErrorMessage: boolean;
  todayMatches: any;
  tomorrowMatches: any;
  otherDaysMatches: any;
  otherDaysMatchesByDate: any;
  FiltersConfig = FiltersConfig;

  constructor(
      private matchService: MatchService,
      private store: Store<AppState>,
      private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.showSkeleton = true;
    this.date = moment().format('YYYY-MM-DD');
  }

  ngOnInit(): void {

    this.clubId$ = of(this.clubId);
    this.selectedDate$ = this.store.select('selectedDate');
    this.searchFilters$ = this.store.select('filter');

    this.filtersSubscription$ = combineLatest(
      [
        this.clubId$,
        this.selectedDate$.pipe(
          debounceTime(500),
          distinctUntilChanged()
        ),
        this.searchFilters$.pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
      ]
    )
    .pipe(
      distinctUntilChanged(),
      map(res => {
        return {
          clubId: res[0],
          selectedDate: moment(res[1]),
          searchFilters: res[2]
        };
      }),
      tap( parameters => {
        this.requestParameters = parameters;
        this.reloadMatches(true, this.requestParameters);
      })
    )
    .subscribe( () => {
      // ;
    });
  }

  reloadMatches(reset = false, parameters) {
    this.displayNoMatchMessage = false;
    this.displayErrorMessage = false;
    // this.displaySearchRequestError = false;
    if (reset) {
      this.showSkeleton = true;
      this.matches = [];
    }

    this.matchService.getMatches(parameters, true)
      .pipe(
        tap( data => {
          if (data !== undefined) {
            this.displayErrorMessage = false;
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
            this.displayErrorMessage = true;
          }
        }),
        map( data => {
          if (data !== undefined) {
            return data['hydra:member'];
          } else {
            return [];
          }
        }),
        map( matches => {
          return matches.filter( match => {
            return matches.filter( m => {
              return (m.access !== 'for_guest') || (m.access === 'for_guest' && match.userClient.id === this.userId);
            });
          });
        }),
        tap( matches => {
          this.todayMatches = [];
          this.tomorrowMatches = [];
          this.otherDaysMatches = [];
          if (reset) {
            this.matches = matches;
          } else {
            // this.matches.push(matches);
            // matches.forEach( match => this.matches.push(match));
            this.matches = [...this.matches, ...matches];
          }
          if (this.matches.length === 0) {
            this.displayNoMatchMessage = true;
          } else {
            this.sortByDate(this.matches);
            this.displayNoMatchMessage = false;
          }
          this.showSkeleton = false;
        })
      )
      .subscribe(() => {
        this.isLoadingMoreData = false;
      });







    /* this.matchService.getMatches(parameters, true)
      .pipe(
        tap( data => {
          this.showSkeleton = false;
          if (data !== undefined) {
            if (reset) {
              this.matches = data['hydra:member'];
            } else {
              this.matches.push(data['hydra:member']);
            }
            this.sortByDate(this.matches);
            if (data['hydra:view']['hydra:next']) {
              this.hasNext = true;
              this.nextPage = data['hydra:view']['hydra:next'];
            } else {
              this.hasNext = false;
            }
            if (this.matches.length === 0) {
              this.displayNoMatchMessage = true;
            }
          } else {
            this.displayErrorMessage = true;
          }
        })
      )
      .subscribe(data => {
      }); */
  }

  sortByDate(matches) {
    this.todayMatches = matches.filter( match => {
      return (moment().format('LL') === moment(match.startAt).format('LL'));
    });

    this.tomorrowMatches = matches.filter( match => {
      return (moment().add(1, 'days').format('LL') === moment(match.startAt).format('LL'));
    });

    this.otherDaysMatches = matches.filter( match => {
      return (
        !(moment().format('LL') === moment(match.startAt).format('LL')) &&
        !(moment().add(1, 'days').format('LL') === moment(match.startAt).format('LL'))
      );
    });

    this.otherDaysMatchesByDate = this.groupMatchesByDate(this.otherDaysMatches);
  }

  groupMatchesByDate(matches: Array<any>) {
    matches.forEach(match => {
      match.date = moment(match.startAt).format('LL');
    });
    const matchesGroupedBydate = matches.reduce((a, b) => {
      const foundMatch = a.find((match) => match.date === b.date);
      if (foundMatch) {
        foundMatch.matches.push(b);
      } else {
        a.push({ date: b.date, matches: [b] });
      }
      return a;
    }, []);
    return matchesGroupedBydate;
  }

  /* groupNotifsByDate(notifs) {
    notifs.forEach(notif => {
        notif.date = moment(notif.dateAdded).format('LL');
    });
    const notificationsGroupedBydate = notifs.reduce( ( a, b ) => {
        const foundNotif = a.find((notif) => notif.date === b.date);
        if(foundNotif) {
            foundNotif.notifs.push(b);
        } else {
            a.push( { date: b.date, notifs: [b] });
        }
        return a;
    }, []);
    return notificationsGroupedBydate;
  } */

  loadMoreData(event) {
    this.matchesLoadingError = null;
    if (!this.hasNext) {
      event.target.complete();
      event.target.disabled = true;
    } else {
      event.target.disabled = false;
      event.target.enabled = true;
      this.isLoadingMoreData = true;
      this.reloadMatches(false, {nextPage: this.nextPage});
    }
  }

}
