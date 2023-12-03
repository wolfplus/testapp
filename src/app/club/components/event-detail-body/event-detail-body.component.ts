import { Component, Input, OnInit } from '@angular/core';
import { ClubEvent } from '../../models/club-event';

@Component({
  selector: 'app-event-detail-body',
  templateUrl: './event-detail-body.component.html',
  styleUrls: ['./event-detail-body.component.scss']
})
export class EventDetailBodyComponent implements OnInit {
  @Input() event: ClubEvent;

  constructor() { }

  ngOnInit() {}

}
