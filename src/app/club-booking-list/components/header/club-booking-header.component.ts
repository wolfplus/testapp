import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NavController} from '@ionic/angular';
import * as SelectedDateActions from '../../../state/actions/selectedDate.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import * as moment from 'moment';
import { CalendarModalOptions } from 'ion2-calendar';
import { LocaleService } from 'src/app/shared/services/translate/locale.service';
import {first} from "rxjs/operators";

@Component({
  selector: 'app-club-booking-header',
  templateUrl: './club-booking-header.component.html',
  styleUrls: ['./club-booking-header.component.scss'],
})
export class ClubBookingHeaderComponent implements OnInit {
  @Input() selectedTime: any;
  @Input() selectedDate: any;
  @Input() showTimes: boolean;
  @Input() name: string;
  @Input() openningHour: string;
  @Input() closingHour: string;
  @Input() minDuration: number;
  @Input() clubId: string;
  @Input() clubDetails: any;
  @Input() clubTimezone: string;
  @Output() reload = new EventEmitter<void>();
  @Output() changeSelectedTime = new EventEmitter();
  @Output() changeCours = new EventEmitter();
  @Input() filterSelected: any;
  @Input() coursSelected:any;
  @Input() eventSelected:any;
  @Input() from: string;
  @Input() showTimeline: boolean = true;
  @Input() isBySlot: boolean = true;
  showdate: boolean;
  calendar: boolean;
  date: any;
  type: any;
  times: Array<any>;
  calendarOptions: CalendarModalOptions;



  constructor(
    private navCtrl: NavController,
    private store: Store<AppState>,
    private localeService: LocaleService
  ) {
    this.showdate = false;
    this.calendar = false;
    this.times = [];
  }

  ngOnInit() {
    this.calendarOptions = this.localeService.getCalendarOptions();
  }

  onChange() {
    this.store.dispatch(new SelectedDateActions.AddSelectedDate(this.date));
    this.calendar = false;
    this.reloadPlaygrounds();
  }

  close(){
    this.showdate = false;
    this.navCtrl.back();
  }

  showCalendar() {
    this.calendar = !this.calendar;
  }

  ngAfterViewInit(): void {
    this.showdate = true;
  }

  reloadPlaygrounds() {
    this.reload.emit();
  }

  reloadBookings($event) {
    this.reload.emit($event);
  }

  generateTimesChoice() {
    this.times = [];
    for (let i = 0; i < 20; i++) {
      this.times.push(moment().second(0).add(((this.minDuration / 60) * i), 'minutes'));
    }
  }

  switchCours() {
    this.coursSelected = !this.coursSelected;
    this.changeCours.emit({coursSelected: this.coursSelected});
  }

  updateTimes(event) {
    this.times = event;
    this.store.select('selectedDate')
        .pipe(first())
        .subscribe(date => {
          const oldTime = moment(date).format('HH:mm');
          let timeToSend = this.times[0];
          this.times.forEach(time => {
            if(time.format('HH:mm') === oldTime) {
              timeToSend = time;
              return;
            }
          })
          this.changeTime(timeToSend);
        });
  }

  changeTime(event) {
    this.selectedTime = event;
    this.changeSelectedTime.emit(event);
    this.reload.emit();
  }
}
