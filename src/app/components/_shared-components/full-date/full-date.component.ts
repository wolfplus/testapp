import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-full-date',
  templateUrl: './full-date.component.html',
  styleUrls: ['./full-date.component.css']
})
export class FullDateComponent implements OnInit {

  @Input() startAt: string;
  @Input() timeZone: string;

  startDate: any;
  startTime: string;

  constructor(
    @Inject(LOCALE_ID) public locale: string
  ) {
  }

  ngOnInit() {
    const date = moment(this.startAt).tz(this.timeZone);
    this.startDate = date.format('LL');
    this.startTime = date.format('HH:mm');
  }


}
