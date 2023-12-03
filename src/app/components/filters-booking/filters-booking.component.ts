import { LocaleService } from './../../shared/services/translate/locale.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Filter, FiltersConfig } from '../../shared/models/filter';
import { tap } from 'rxjs/operators';
import * as FilterActions from '../../state/actions/filter.actions';
import * as SelectedDateActions from '../../state/actions/selectedDate.actions';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { animate, style, transition, trigger } from '@angular/animations';
import { CalendarModalOptions } from 'ion2-calendar';

@Component({
  selector: 'app-filters-booking',
  templateUrl: './filters-booking.component.html',
  styleUrls: ['./filters-booking.component.scss'],
  animations: [
    trigger(
      'outAnimation',
      [
        transition(
          ':leave',
          [
            style({ height: 'auto' }),
            animate('.8s ease-out',
              style({ height: '0px' }))
          ]
        )
      ]
    )
  ]
})
export class FiltersBookingComponent implements OnInit {
  @Input() clubId: string;
  @Input() displayCalendarPicker = true;
  @Input() config = FiltersConfig.BOOKING;
  @Output() filtersChange = new EventEmitter();

  filters: Observable<Filter[]>;
  showCalendar: boolean;
  date: any;
  type: 'string';
  FiltersConfig = FiltersConfig;
  calendarOptions: CalendarModalOptions

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private localeService: LocaleService
  ) {
    this.showCalendar = false;
    this.date = moment();
    this.filters = store.select('filter').pipe(tap(data => {
      return data;
    }));

    this.store.select('selectedDate').pipe(tap(date => {
      if (date !== undefined && date !== '') {
        this.date = date;
      }
    })).toPromise();
  }

  ngOnInit() {
    this.calendarOptions = this.localeService.getCalendarOptions()
  }

  tapCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  onChange() {
    this.showCalendar = !this.showCalendar;
    this.filtersChange.emit();
    this.store.dispatch(new SelectedDateActions.AddSelectedDate(moment(this.date).minute(0).hour(0).second(0).millisecond(0).utc(true)));
  }

  removeFilter(index) {
    this.store.dispatch(new FilterActions.RemoveFilter(index));
    this.filtersChange.emit();
  }
  getDateSelectedString() {
    const today = moment();
    const tomorow = moment().add(1, 'day');
    if (!this.date || today.format('YYYYMMDD') === this.date.format('YYYYMMDD')
    ) {
      return this.translate.instant('d_day');
    } else if (tomorow.format('YYYYMMDD') === this.date.format('YYYYMMDD')) {
      return this.translate.instant('next_day');
    } else {
      return this.date.format('DD/MM/YYYY');
    }
  }
}
