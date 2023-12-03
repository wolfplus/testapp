import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import * as FilterActions from '../../state/actions/filter.actions';
import {Filter, FilterCategory, FilterKey} from '../../shared/models/filter';
import {Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';
import {Observable} from 'rxjs';
import {Activity} from '../../shared/models/activity';
import {ActivityService} from '../../shared/services/activity/activity.service';
import {tap, toArray} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-choice-activity',
  templateUrl: './choice-activity.component.html',
  styleUrls: ['./choice-activity.component.scss']
})
export class ChoiceActivityComponent implements OnInit {

  skeletonShow: boolean;
  searchActivity: string;
  activities: Observable<Activity|any>;
  constructor(
      private modalCtr: ModalController,
      private store: Store<AppState>,
      private activityService: ActivityService,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.searchActivity = '';
    this.skeletonShow = true;
    this.activities = this.activityService.getActivities().pipe(toArray(), tap(() => {
      this.skeletonShow = false;
    }));
  }

  choiceActivity(name: string, value: string) {
      this.store.dispatch(new FilterActions.RemoveFilterByKeyFilter('ACTIVITY'));
      const data: Filter = {
        label: name,
        keyFilter: FilterKey.ACTIVITY,
        category: FilterCategory.CLUB,
        value: '' + value
      };
      this.store.dispatch(new FilterActions.Addfilter(data));
      this.modalCtr.dismiss().then(() => {
        this.router.navigate(['/search-club']);
      });
  }

  search(name: string) {
    if (this.searchActivity === '') {
      return true;
    } else if ( name.toLowerCase().includes(this.searchActivity.toLowerCase())) {
      return true;
    }
    return false;
  }

  close() {
    this.modalCtr.dismiss().then();
  }

}
