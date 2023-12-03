import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Activity } from '../../models/activity';
import { getActivityCategoriesLoadingState, getCurrentClubActivityCategories } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-activities',
  templateUrl: './club-activities.component.html',
  styleUrls: ['./club-activities.component.scss']
})
export class ClubActivitiesComponent implements OnInit {
/* TODO: put the baseUrl in environment file */
  baseUrl = "https://api.doinsport.dv:8443";
  /* TODO: add translation */
  title$ = this.translator.get('activities');
  activities$: Observable<Array<Activity>>;
  activitiesLoadingState$: Observable<{
      categoriesAreLoading: boolean;
      categoriesAreLoaded: boolean;
  }>;

  constructor(
    private store: Store<ClubState>,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.activities$ = this.store.pipe(select(getCurrentClubActivityCategories));
    this.activitiesLoadingState$ = this.store.pipe(select(getActivityCategoriesLoadingState));
  }

}
