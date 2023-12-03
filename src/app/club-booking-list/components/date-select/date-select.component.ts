import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { map, tap } from 'rxjs/operators';
import * as SelectedDateActions from '../../../state/actions/selectedDate.actions';
import { Observable } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { CalendarModalOptions } from 'ion2-calendar';
import { LocaleService } from 'src/app/shared/services/translate/locale.service';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.scss'],
  animations: [
    trigger(
      'enterLeave',
      [
        transition(
          ':enter',
          [
            style({ marginTop: '-100%', zIndex: -1, opacity: 0 }),
            animate('.2s ease-out',
              style({ marginTop: 0, zIndex: 9 })
            ),
            animate('.8s', style({ opacity: 1 }))

          ]
        ),
        transition(
          ':leave',
          [
            style({ marginTop: 0, zIndex: 9, opacity: 0 }),
            animate('.5s ease-in',
              style({ marginTop: '-100%', zIndex: 0 })
            )
          ]
        )
      ]
    )
  ]
})
export class DateSelectComponent implements OnInit {
  @Output() calendarButtonClicked = new EventEmitter<void>();
  @Output() reload = new EventEmitter<void>();

  calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="21.339" height="21.339" viewBox="0 0 21.339 21.339"><path d="M43.784,329a.5.5,0,0,1,.5.5v3.047a1.985,1.985,0,1,1-.993,0V329.5A.5.5,0,0,1,43.784,329Zm-9.429,0a.5.5,0,0,1,.5.5v3.047a1.985,1.985,0,1,1-.993,0V329.5A.5.5,0,0,1,34.356,329Zm12.9,1.489a2.5,2.5,0,0,1,2.489,2.49v14.872a2.494,2.494,0,0,1-2.489,2.489H30.9a2.5,2.5,0,0,1-2.49-2.489V332.978a2.5,2.5,0,0,1,2.49-2.49h1.481a.5.5,0,1,1,0,.993H30.9a1.485,1.485,0,0,0-1.5,1.5v4.458H48.755v-4.458a1.485,1.485,0,0,0-1.5-1.5H45.777a.5.5,0,1,1,0-.993Zm-5.452,0a.5.5,0,1,1,0,.993H36.348a.5.5,0,0,1,0-.993Zm1.977,2.977a.993.993,0,1,0,.993.993A.985.985,0,0,0,43.784,333.466Zm-9.429,0a.993.993,0,1,0,.993.993A.985.985,0,0,0,34.356,333.466Zm14.4,4.963H29.4v9.422a1.484,1.484,0,0,0,1.5,1.5H47.259a1.484,1.484,0,0,0,1.5-1.5Z" transform="translate(-28.408 -329)"/></svg>`;
  showCalendar = false;
  selectedDate: any;
  selectedDateFormat: string;
  dates$: Observable<any[]>;
  calendarOptions: CalendarModalOptions;

  constructor(
    private store: Store<AppState>,
    private localeService: LocaleService
  ) { }

  ngOnInit() {
    this.calendarOptions = this.localeService.getCalendarOptions();
    this.dates$ = this.store.select('selectedDate')
      .pipe(
        tap(date => {
          if (date !== undefined && date !== '') {
              const start = moment();
              const remainder = 30 - (start.minute() % 30);
              const dateTime = moment(start).add(remainder, "minutes");
              const newDate = moment(date).set('hour', parseInt(dateTime.format("HH"))).set('minute', parseInt(dateTime.format("mm")));
            this.selectedDate = newDate;
            this.selectedDateFormat = this.selectedDate.format('YYYY-MM-DD HH:mm:ss');
          } else {
              const start = moment();
              const remainder = 30 - (start.minute() % 30);
              const dateTime = moment(start).add(remainder, "minutes");
              const newDate = moment(date).set('hour', parseInt(dateTime.format("HH"))).set('minute', parseInt(dateTime.format("mm")));
              this.selectedDate = newDate;
              this.selectedDateFormat = this.selectedDate.format('YYYY-MM-DD HH:mm:ss');
            this.store.dispatch(new SelectedDateActions.AddSelectedDate(this.selectedDate));
          }
        }),
        map(() => {
          let i = -1;
          const tempDates = [];
          while (i < 4) {
            const start = moment(this.selectedDate);
            start.add(i, 'days');
            tempDates.push(start);
            i++;
          }
          return tempDates;
        }),
      );
  }

  openCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  nextActive(date, dateSelected) {
    const diff = parseInt(date.format('YYYYMMDD'), 0) - parseInt(dateSelected.format('YYYYMMDD'), 0);
    return (diff === 1);
  }

  selectDate(date) {
    // this.selectedDate = date;
    const now = moment();
    if (date.format('YYYYMMDD') < now.format('YYYYMMDD')) {
      return;
    }
    this.store.dispatch(new SelectedDateActions.AddSelectedDate(date));
    this.reloadData();
  }

  reloadData() {
    this.reload.emit();
  }

  onChange(event) {
    const date = moment(event);
    this.showCalendar = !this.showCalendar;
      const start = moment();
      const remainder = 30 - (start.minute() % 30);
      const dateTime = moment(start).add(remainder, "minutes");
      const newDate = date.set('hour', Number(dateTime.format("HH"))).set('minute', Number(dateTime.format("mm")));
    this.store.dispatch(new SelectedDateActions.AddSelectedDate(newDate));
    this.reloadData();
  }
}
