import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-attender-avatar',
  templateUrl: './event-attender-avatar.component.html',
  styleUrls: ['./event-attender-avatar.component.scss']
})
export class EventAttenderAvatarComponent implements OnInit {
  /* TODO: attender type ? */
  @Input() attender: any;
  constructor() { }

  ngOnInit() {
  }

}
