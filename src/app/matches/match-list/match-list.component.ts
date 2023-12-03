import {
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import {map, switchMap, takeUntil, tap} from 'rxjs/operators';
import { ClubMatch } from '../match.model';
import { MatchActions } from '../store';
import { MatchState } from '../store/match.reducer';
import {
  getAllMatches,
  getHydraView,
  getMatchesLoadedState,
  getMatchesLoadingError,
  getMatchesLoadingState } from '../store/match.selectors';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import { TranslateService } from '@ngx-translate/core';
import {EnvironmentService} from "../../shared/services/environment/environment.service";

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Input() isLoadingMoreData = false;
  @Input() userId: string;
  @Output() loadNext = new EventEmitter();
  @Output() reloadMatches = new EventEmitter();

  env;
  MatchCardConfig = MatchCardConfig;
  //matches: ClubMatch[] = [];
  matches$: Observable<ClubMatch[]>;
  matchesAreLoaded$: Observable<boolean>;
  matchesAreLoading$: Observable<boolean>;
  matchesLoadingError$: Observable<string | undefined>;
  hasNext: boolean;
  nextPage: string;
  isLoaded = false;
  //allSubscriptions$ = new Subscription();
  once = 0;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private matchstore: Store<MatchState>,
    private translateService: TranslateService,
    private environmentService: EnvironmentService  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit() {
    this.matches$ = this.matchstore.pipe(select(getAllMatches))
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap( _response => {
          if (this.infiniteScroll) {
            this.infiniteScroll.complete();
            this.infiniteScroll.disabled = false;
          }
        }),
        map( matches => {
          return matches.filter( m => {
            return (m.access !== 'for_guest') || (m.access === 'for_guest' && m.userClient.id === this.userId) === true;
          });
        }),
        tap( matches => {
          if (matches.length < 1) {
            // TODO Match: display message not any match
          }
        })
      );

      this.matchesAreLoaded$ = this.matchstore.pipe(select(getMatchesLoadedState))
      .pipe(
        takeUntil(this.ngUnsubscribe),
      );

      this.matchesAreLoading$ = this.matchstore.pipe(select(getMatchesLoadingState))
      .pipe(
        takeUntil(this.ngUnsubscribe)
      );

      this.matchesLoadingError$ = this.matchstore
      .pipe(
        select(getMatchesLoadingError),
        takeUntil(this.ngUnsubscribe),
        switchMap( error => {
          if (error !== null && error !== undefined) {
            if (error === "add_search_criterias") {
              return of(this.translateService.instant('add_search_criterias'));
            } else {
              return of(error as string);
            }
          } else {
            return of(undefined);
          }
        })
      );

      this.matchstore
      .pipe(
        select(getHydraView),
        takeUntil(this.ngUnsubscribe),
        tap(hydraView => {
          if (hydraView !== null && hydraView['hydra:next'] !== undefined) {
            this.hasNext = true;
            this.nextPage = hydraView['hydra:next'];
          } else {
            this.hasNext = false;
          }
        })
      ).subscribe();

  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  reload(event) {
    // this.matchesLoadingError = of(undefined);
    this.reloadMatches.emit(event);
  }

  loadMoreData(event) {
    // this.matchesLoadingError = of(undefined);
    if (!this.hasNext) {
      event.target.complete();
      event.target.disabled = true;
    } else {
      event.target.disabled = false;
      event.target.enabled = true;
      this.isLoadingMoreData = true;
      this.matchstore.dispatch(MatchActions.loadMatchs({parameters: {nextPage: this.nextPage}}));
    }
  }

}