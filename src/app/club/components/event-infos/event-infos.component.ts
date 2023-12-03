import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-infos',
  templateUrl: './event-infos.component.html',
  styleUrls: ['./event-infos.component.scss']
})
export class EventInfosComponent implements OnInit {

  @Input() eventSport: string;
  @Input() eventLevels: Array<object|number>;
  @Input() eventCategory: string;
  @Input() eventGender: number;
  @Input() eventLimitRegistrationDate: string | Date;
  @Input() eventCancellationConditions: {type: string, condition: string};
  levelsColors: Array<any>;
  constructor() { }

  ngOnInit() {
  }

}
