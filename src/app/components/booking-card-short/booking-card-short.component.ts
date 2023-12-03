import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { ElementPosition } from 'src/app/shared/models/style';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-booking-card-short',
  templateUrl: './booking-card-short.component.html',
  styleUrls: ['./booking-card-short.component.scss']
})
export class BookingCardShortComponent {
  /* TODO: Booking model */
  @Input() booking: any;
  ElementPosition = ElementPosition;

  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  constructor(
    private environmentService: EnvironmentService) { }

  getDuration(): number {
    let duration;
    const start = moment(this.booking.startAt);
    const end = moment(this.booking.endAt);

    duration = end.diff(start, 'minutes');
    return duration;
  }

}
