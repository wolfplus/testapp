import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-date-and-type',
  templateUrl: './event-date-and-type.component.html',
  styleUrls: ['./event-date-and-type.component.scss']
})
export class EventDateAndTypeComponent implements OnInit {
  /* TODO: add a type for the date. string or Date ? */
  @Input() date: any;
  @Input() type: string;
  @Input() showIcon: boolean;
  @Input() textColor: string;
  @Input() textAlign: string;

  constructor() { }

  ngOnInit() {
  }

}
