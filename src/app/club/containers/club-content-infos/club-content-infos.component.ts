import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { getCurrentClubId, getCurrentClubLoadedState } from '../../store';
import { ClubActions } from '../../store/actions';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-content-infos',
  templateUrl: './club-content-infos.component.html',
  styleUrls: ['./club-content-infos.component.scss']
})
export class ClubContentInfosComponent implements OnInit, OnDestroy {

  clubId: string;
  subscription$: Subscription;
  contentIsLoaded$: Observable<boolean>;
  // TODO: remove after test
  loaderIsActive$: Observable<boolean>;

  constructor(
    private store: Store<ClubState>
  ) { }

  ngOnInit() {
    this.subscription$ = this.store.pipe(select(getCurrentClubId))
      .pipe(
        filter(Boolean),
        tap( (id: string) => {
          this.clubId = id;
          this.store.dispatch(ClubActions.loadClubServices({clubId: id}));
          this.store.dispatch(ClubActions.loadClubActivityCategories({clubId: id}));
        })
      )
      .subscribe();

    this.contentIsLoaded$ = this.store.select(getCurrentClubLoadedState);

      // TODO: Maybe activate loader until the booking page is loaded
      // this.loaderIsActive$ = of(false);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  bookNow() {
    // TODO: implement action => go to booking page
  }

}
