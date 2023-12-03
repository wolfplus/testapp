import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { tap } from 'rxjs/operators';
import { FiltersPage } from 'src/app/modal/filters/filters.page';

@Component({
  selector: 'app-filtre-playground',
  templateUrl: './filtre-playground.component.html',
  styleUrls: ['./filtre-playground.component.scss'],
})
export class FiltrePlaygroundComponent implements OnInit {
  @Input() openningHour: string;
  @Input() closingHour: string;
  @Input() selectedTime: any;
  @Input() clubId: string;
  @Input() isBySlot: boolean = true;
  @Output() setTimes = new EventEmitter();
  @Output() reload = new EventEmitter();
  @Input() coursSelected: any;
  @Input() eventSelected: any;


  startTime: any;
  endTime: any;
  selectedActivity: string;

  constructor(
    private modalService: ModalService,
    private store: Store<AppState>
  ) {

  }

  ngOnInit() {



    const position = parseInt('' + (this.selectedTime.hours() / 4), null);
    this.startTime = moment().hours(position * 4).minutes(0);
    this.endTime = moment().hours((position * 4) + 4).minutes(0);
    this.loadTimes();
    this.initFilter();
  }

  initFilter() {
    this.store.select('filter').pipe(tap(filters => {
      this.selectedActivity = undefined;
      filters.forEach(item => {
        if (item.keyFilter === 'ACTIVITY') {
          this.selectedActivity = item.label;
        }
      });
    })).toPromise();
  }

  openFilterModal() {
    this.modalService.filterSearchModal(FiltersPage, this.clubId).then(mod => {
      mod.onDidDismiss().then(() => {
        this.reload.emit();
        this.initFilter();
      });
    });
  }

  previousRangeTime() {
    // const openningHour = parseInt(this.openningHour.split(':')[0], 10);
    if (this.startTime.hour() !== 0) {
      /*
      if (this.startTime.hour() > openningHour) {
        this.startTime = this.startTime.hours(this.startTime.hour() - 4);
        this.endTime = this.endTime.hours(this.endTime.hour() - 4);
      } else {
        this.startTime = this.startTime.hours(openningHour).minutes(0);
        this.endTime = this.endTime.hours(this.endTime.hour());
      }
      this.loadTimes();*/

      this.startTime = this.startTime.hours(this.startTime.hour() - 4);
      this.endTime = this.endTime.hours(this.endTime.hour() - 4);
      this.loadTimes();
    }
  }

  nextRangeTime() {
    // const closingHour = (parseInt(this.closingHour.split(':')[0], 10) === 0) ? 24 : parseInt(this.closingHour.split(':')[0], 10);
    if (this.endTime.hour() !== 0) {
      // if (this.endTime.hour() < closingHour) {
      this.startTime = this.startTime.hours(this.startTime.hour() + 4);
      this.endTime = this.endTime.hours(this.endTime.hour() + 4);
      /*} else {
        this.startTime = this.startTime.hours(this.startTime.hour());
        this.endTime = this.endTime.hours(closingHour).minutes(0);
      } */
      this.loadTimes();
    }

  }
  loadTimes() {
    const times = [];
    let startTest = this.startTime.clone();
    let endTest = this.endTime.clone();
    if (this.openningHour && this.closingHour) {

      // startTest = (this.startTime < openningDate) ? openningDate : this.startTime.clone();
      // endTest = (this.endTime > closingDate) ? closingDate : this.endTime.clone();

      startTest = this.startTime.clone();
      endTest = this.endTime.clone();
    }

    while (startTest < endTest) {
      const startVal = startTest.clone();
      times.push(startVal);
      startTest.add(30, 'minutes');
    }
    if (times.length !== 0) {
      this.setTimes.emit(times);
    }

  }
}
