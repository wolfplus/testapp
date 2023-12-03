import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TimeTable } from '../../models/timetable';
import { getCurrentClubLogoUrl, getCurrentClubLoadedState, getCurrentClubLoadingState, getCurrentClubTimeTables } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-timetable',
  templateUrl: './club-timetable.component.html',
  styleUrls: ['./club-timetable.component.scss']
})
export class ClubTimetableComponent implements OnInit, OnDestroy {
  baseUrl = 'https://api.doinsport.dv:8443';
  timetables: Array<any> = [];
  formattedTimetables: Array<any> = [];
  clubLogoUrl$: Observable<string>;
  clubIsOpen: boolean;
  timeTablesSubscription$: Subscription;
  clubIsLoading$: Observable<boolean>;
  clubIsLoaded$: Observable<boolean>;

  constructor(private store: Store<ClubState>) { }

  ngOnInit() {
    this.clubLogoUrl$ = this.store.pipe(select(getCurrentClubLogoUrl));

    this.timeTablesSubscription$ = this.store.pipe(select(getCurrentClubTimeTables))
      .pipe(
        filter(Boolean)
      )
      .subscribe( (timetables: Array<TimeTable>) => {
        this.timetables = timetables;
        this.formatTimetables(this.timetables);
        this.clubIsOpen = this.isOpenNow(this.timetables);
      });

    this.clubIsLoading$ = this.store.pipe(select(getCurrentClubLoadingState));
    this.clubIsLoaded$ = this.store.pipe(select(getCurrentClubLoadedState));
  }

  ngOnDestroy(){
    this.timeTablesSubscription$.unsubscribe();
  }

  formatTimetables(timetables: TimeTable[]) {
    // forEach timetable => get the daysOfTheWeek => Loop on the days
    // Check if days are subsequent
    // If days are subsequent take first and last : [0,1,2] => return Dim-Mar
    // If not return distinct groups of subsequent days : [0,1,3] => return Dim-Lun, Mer
    // For the time take the opentAt of first in Array and closeAt of Last in Array
    // return an Array of Objects like: [ { daysToString: ["Lun-Mer, Ven-Sam"], openClose: ["08:00-17:00"] }, ...]
    this.formattedTimetables = [];
    if (timetables.length === 0) {
      return;
    }
    timetables.forEach( timetable => {
      const firstDay = timetable.daysOfTheWeek[0];
      const lastDay = timetable.daysOfTheWeek[timetable.daysOfTheWeek.length - 1];
      let daysString = '';
      const blockArray = [];

      if ((lastDay - firstDay) === timetable.daysOfTheWeek.length - 1) {
        daysString = moment().weekday(firstDay).format('ddd')
          + ' - ' +
          moment().weekday(lastDay).format('ddd');

      } else {
        for (let i = 0; i < timetable.daysOfTheWeek.length; i++) {
          i === 0 ?
            daysString += moment().weekday(timetable.daysOfTheWeek[i]).format('ddd') :
            daysString += ' - ' + moment().weekday(timetable.daysOfTheWeek[i]).format('ddd');
        }
      }

      timetable.blocks.forEach( block => {
        blockArray.push(block.openAt + '-' + block.closeAt);
      });

      this.formattedTimetables.push({ days: daysString, blocks: blockArray});
    });
  }

  isOpenNow(timetables: Array<any>): boolean {
    const now = moment(new Date());
    const nowDayOfWeek = now.day();
    const openingDate = moment(new Date());
    const closingDate = moment(new Date());
    let matchingTimeTableBlocks;

    timetables.forEach(tt => {
      return tt.daysOfTheWeek.forEach(day => {
          if (day === nowDayOfWeek){
            matchingTimeTableBlocks = tt.blocks;
          }
      });
    });

    if (matchingTimeTableBlocks === undefined) {
      return false;
    }

    let result = false;

    for (let i = 0; i < matchingTimeTableBlocks.length; i++) {
      const openingTimeStr = matchingTimeTableBlocks[i]['openAt'];
      const closingTimeStr = matchingTimeTableBlocks[i]['closeAt'];
      const openingTime = moment(openingTimeStr, 'HH:mm');
      const closingTime = moment(closingTimeStr, 'HH:mm');

      openingDate.set({
          hour:   openingTime.get('hour'),
          minute: openingTime.get('minute'),
          second: openingTime.get('second')
      });

      closingDate.set({
        hour:   closingTime.get('hour'),
        minute: closingTime.get('minute'),
        second: closingTime.get('second')
      });

      result = now.isBetween(openingDate, closingDate);

      if (result === true) {
        return true;
      } else {
        continue;
      }
    }
    return result;
  }

}
