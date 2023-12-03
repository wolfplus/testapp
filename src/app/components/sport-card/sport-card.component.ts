import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';
import * as FilterActions from '../../state/actions/filter.actions';

import { FilterCategory, FilterKey } from 'src/app/shared/models/filter';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-sport-card',
  templateUrl: './sport-card.component.html',
  styleUrls: ['./sport-card.component.scss'],
})
export class SportCardComponent implements OnInit, AfterViewInit {
  @Input() guid: string;
  @Input() title: string;
  @Input() colors: Array<string>;
  @Input() icon: string;
  @Input() pic: string;

  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  backgroundGradient: string;
  backgroundImgUrl: string;
  ready: boolean;
  constructor(
    public router: Router,
    public store: Store<AppState>,
    private environmentService: EnvironmentService
  ) {
    this.ready = false;
  }

  ngOnInit() {
    this.backgroundImgUrl = `${this.baseUrl}${this.pic}`;
  }

  ngAfterViewInit() {
    this.ready = true;
    // this.backgroundImage = `url(${this.baseUrl}${this.pic})`;
  }

  searchSport() {
    if (this.guid === null) {
      return;
    }
    this.store.dispatch(new FilterActions.RemoveFilterByKeyFilter('ACTIVITY'));
    this.store.dispatch(new FilterActions.Addfilter({
      keyFilter: FilterKey.ACTIVITY,
      value: this.guid,
      label: this.title,
      category: FilterCategory.CLUB,
    }));
    this.router.navigate(['/search-club']).then();
  }

  setGradient() {
    return {
      background: `linear-gradient(180deg, ${this.colors[0]}, ${this.colors[1]})`,
      'background-repeat': 'no-repeat',
      opacity: '.65'
    };
  }
}
