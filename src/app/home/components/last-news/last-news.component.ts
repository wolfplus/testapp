import { map } from 'rxjs/operators';
import { ClubNews } from './../../../shared/models/club-news';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ModalService } from 'src/app/shared/services/modal.service';
import * as ClubNewsActions from 'src/app/state/actions/clubNews.actions';
import { AppState } from 'src/app/state/app.state';
import { ClubNewsState } from 'src/app/state/reducers/clubNews.reducer';

import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import { ClubNewsDetailsComponent } from 'src/app/club-news/club-news-details/club-news-details.component';

@Component({
  selector: 'app-last-news',
  templateUrl: './last-news.component.html',
  styleUrls: ['./last-news.component.scss']
})
export class LastNewsComponent implements OnInit, OnDestroy {
  news$: Observable<ClubNewsState>;
  showSkeleton = true;
  clubNewsSubscription: Subscription;
  clubNewsList: ClubNews[] = [];
  clubNewsTotalItems = 0;
  clubIdStorage: any;
  slideOpt = {
    slidesPerView: 1
  };

  slideOptTablet = {
    slidesPerView: 3
  };

  constructor(
    private modalService: ModalService,
    private store: Store<AppState>,
    private clubIdStorageService: ClubIdStorageService
  ) {
    this.news$ = this.store.pipe(select('clubNews'));
  }

  async ngOnInit() {

    await this.clubIdStorageService.getClubId().then(clubId =>  {
      this.store.dispatch(ClubNewsActions.getClubNewsList({ payload: clubId}));
      this.clubNewsSubscription = this.news$
          .pipe(
              map((clubNews: ClubNewsState) => {
                this.clubNewsList = clubNews.clubNewsList;
                this.clubNewsTotalItems = clubNews.totalItems;
                this.showSkeleton = false;
              })
          )
          .subscribe();
    });
  }

  openNewsDetails(clubNews) {
    this.modalService.presentNewsDetails(ClubNewsDetailsComponent, clubNews['@id']);
  }

  ngOnDestroy() {
    if (this.clubNewsSubscription) {
      this.clubNewsSubscription.unsubscribe();
    }
  }

}
