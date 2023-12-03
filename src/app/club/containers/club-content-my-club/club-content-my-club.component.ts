import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { getCurrentClubId } from '../../store';
import { ClubActions } from '../../store/actions';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-content-my-club',
  templateUrl: './club-content-my-club.component.html',
  styleUrls: ['./club-content-my-club.component.scss'],
  animations: [ // For example
    trigger(
      'enterLeave',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('3s ease-out',
                    style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1}),
            animate('1s ease-in',
                    style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class ClubContentMyClubComponent implements OnInit, OnDestroy {
  // TODO: remove of and delay after test
  subscription$: Subscription;

  constructor(private clubStore: Store<ClubState>) {}

  ngOnInit() {

    this.subscription$ = this.clubStore.pipe(
      select(getCurrentClubId),
      tap(clubId => {
        this.clubStore.dispatch(ClubActions.loadClubUpcomingEvents({clubId}));
        this.clubStore.dispatch(ClubActions.loadClubUpcomingCourses({clubId}));
      })
    )
    .subscribe();
  }

  ngOnDestroy(){
    this.subscription$.unsubscribe();
  }

}
