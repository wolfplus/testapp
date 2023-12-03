import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ClubMatch } from 'src/app/matches/match.model';
import { MatchActions } from 'src/app/matches/store';
import { MatchState } from 'src/app/matches/store/match.reducer';
import { getAllMatches, getMatchesLoadedState, getMatchesLoadingState } from 'src/app/matches/store/match.selectors';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import { getDurationInMinutes } from 'src/utils/getDurationInMinutes';
import { getCurrentClubId } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-content-matchs',
  templateUrl: './club-content-matchs.component.html',
  styleUrls: ['./club-content-matchs.component.scss']
})
export class ClubContentMatchsComponent implements OnInit, OnDestroy {
  matches: Array<ClubMatch>;
  contentIsLoading$: Observable<boolean>;
  contentIsLoaded$: Observable<boolean>;
  matchSubscription$: Subscription;

  MatchCardConfig = MatchCardConfig;

  constructor(
    private matchstore: Store<MatchState>,
    private clubStore: Store<ClubState>
  ) {}

  ngOnInit() {
    this.matchSubscription$ = this.clubStore.pipe(
      select(getCurrentClubId),
      filter(Boolean),
      tap((clubId: string) => this.matchstore.dispatch(MatchActions.loadMatchs({parameters: { clubId }}))),
      switchMap(() => {
        return this.matchstore.pipe(select(getAllMatches));
      }),
      map(matches => {
          return matches.map( match => {
            return {
              ...match,
              duration: getDurationInMinutes(match.startAt, match.endAt)
            };
          });
      })
    )
    .subscribe( matches => this.matches = matches);

    this.contentIsLoading$ = this.matchstore.pipe(
      select(getMatchesLoadingState),
      map( isLoading => isLoading)
    );

    this.contentIsLoaded$ = this.matchstore.pipe(
      select(getMatchesLoadedState),
      map( isLoaded => isLoaded)
    );

  }

  ngOnDestroy() {
    this.matchSubscription$.unsubscribe();
  }

  /* TODO: moved to utils / delete if utils is working */
  /* getDuration(match): number {
    let duration;
    const start = moment(match.startDate);
    const end = moment(match.endDate);

    duration = moment.duration(start.diff(end)).minutes();
    return duration;
  } */

}
