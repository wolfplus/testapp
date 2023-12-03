import {AfterViewInit, Component, Input } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';

import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-card-activity-icon',
  templateUrl: './card-activity-icon.component.html',
  styleUrls: ['./card-activity-icon.component.scss'],
})
export class CardActivityIconComponent implements AfterViewInit {
  @Input() guid: string;
  @Input() title: string;
  @Input() icon: string;
  @Input() photo: string;
  @Input() colors: string;
  @Input() isSelected: boolean;

  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  backgroundImgUrl: string;

  constructor(
    public store: Store<AppState>,
    private environmentService: EnvironmentService
  ) { }


  ngAfterViewInit() {
    if (this.photo !== undefined) {
      this.backgroundImgUrl = `${this.baseUrl}${this.photo}`;
    }
  }

  /* addActivity() {
    this.store.dispatch(new FilterActions.RemoveFilterByKeyFilter('ACTIVITY'));
    this.store.dispatch(new FilterActions.Addfilter({
      keyFilter: FilterKey.ACTIVITY,
      value: this.guid,
      label: this.title,
      category: 'club',
    })
    );
  } */

  setGradient() {
    const styles = {
      background: `linear-gradient(90deg, ${this.colors[0]}, ${this.colors[1]})`,
      'background-repeat': 'no-repeat',
      opacity: '.65',
      'border-radius': '.5rem'
    };
    return styles;
  }

}
