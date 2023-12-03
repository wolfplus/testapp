import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-slot-duration',
  templateUrl: './card-slot-duration.component.html',
  styleUrls: ['./card-slot-duration.component.scss'],
})
export class CardSlotDurationComponent implements OnInit {
  @Input() priceData: any;
  @Input() bookable: boolean;
  @Input() currency = '€';

  constructor() {}

  ngOnInit() {
  }

  convertMinutes(seconds: number) {
    const minute = parseInt('' + (seconds / 60), null);
    if (minute <= 60) {
      return minute + ' min';
    } else {
      let hour: any = parseInt(String((minute / 60)), 0);
      const minutes = minute - (hour * 60);
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minutes >= 0 && minutes < 10) {
        return hour + 'h0' + minutes;
      } else {
        return hour + 'h' + minutes;
      }
    }
  }
}
