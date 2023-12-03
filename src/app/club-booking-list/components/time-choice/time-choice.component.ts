import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import * as moment from 'moment';
import * as SelectedDateActions from "../../../state/actions/selectedDate.actions";
import {getCurrentClub} from "../../../club/store";
import {tap} from "rxjs/operators";
import {ClubState} from "../../../club/store/club.reducers";

@Component({
  selector: 'app-time-choice',
  templateUrl: './time-choice.component.html',
  styleUrls: ['./time-choice.component.scss'],
})
export class TimeChoiceComponent implements OnInit {
  showSkeleton: boolean;
  @Input() times: Array<any>;
  @Input() selectedTime: any;
  @Output() changeTime = new EventEmitter();
  clubTimezone
  constructor(
      private clubStore: Store<ClubState>,
      private store: Store<AppState>) {
    this.showSkeleton = true;
  }

  ngOnInit() {

    this.times.forEach(item => {
      item.second(0);
    });
    this.store.select('selectedDate')
      .subscribe(date => {
        this.clubStore.select(getCurrentClub).pipe(tap(club => {
          this.clubTimezone = club.timezone;
          this.selectedTime = this.calculateDate(date);
          console.log(this.selectedTime, "<==== selectedTime");
        })).subscribe();
      });

    const start = moment();
    const remainder = 30 - (start.minute() % 30);
    const dateTime = moment(start).add(remainder, "minutes");
    const initDate = this.selectedTime.set('hour', dateTime.format("HH")).set('minute', dateTime.format("mm"));
    this.store.dispatch(new SelectedDateActions.AddSelectedDate(moment(initDate.format('YYYY-MM-DD HH:mm'))));
  }

  calculateDate(date) {
    let stringDate;
    console.log(this.clubTimezone)
    const now = moment().tz(this.clubTimezone, true);
    if (now.format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
      const currentTime = now.format('HH:mm');
      if (currentTime > this.selectedTime.format('HH:mm')) {
        const HH = now.format('HH');
        let time;
        if (now.format('mm') === '00') {
          time = HH + ':00';
        } else if (now.format('mm') > '00' &&
          (now.format('mm') <= '30')) {
          time = HH + ':30';
        } else {
          time = now.add(1, 'hours').format('HH') + ':00';
        }
        stringDate = moment(date).format('YYYY-MM-DD') + ' ' + time;
      } else {
        stringDate = moment(date).format('YYYY-MM-DD') + ' ' + this.selectedTime.format('HH:mm');
      }
    } else {
      stringDate = moment(date).format('YYYY-MM-DD') + ' ' + this.selectedTime.format('HH:mm');
    }
    return moment(stringDate);
  }

  getHour(time) {
    return time.format('HH:mm');
  }
  select(selected) {
    this.changeTime.emit(selected);
    let newDate = this.selectedTime.set('hour', selected.format("HH")).set('minute', selected.format("mm"));
    newDate = moment(newDate.format('YYYY-MM-DD HH:mm'));
    this.store.dispatch(new SelectedDateActions.AddSelectedDate(newDate));
  }
}
