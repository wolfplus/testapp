import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Booking, BookingCardConfig, BookingReceipt} from '../../shared/models/booking';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {ModalService} from '../../shared/services/modal.service';

import { Period } from 'src/app/shared/enums/period';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { ClassDetailComponent } from 'src/app/club-booking-list/components/class-detail/class-detail.component';
import { BookingDetailComponent } from 'src/app/modal/booking/booking-detail/booking-detail.component';
import { ElementPosition } from 'src/app/shared/models/style';

@Component({
  selector: 'app-card-my-booking',
  templateUrl: './card-my-booking-v2.component.html',
  styleUrls: ['./card-my-booking-v2.component.scss'],
})
export class CardMyBookingComponent implements OnDestroy, OnInit {
  @Input() booking: BookingReceipt|Booking;
  @Input() userMe: any;
  @Input() bookingStatus: Period;
  @Input() cardConfig: BookingCardConfig = BookingCardConfig.LARGE;
  @Output() reload = new EventEmitter();

  Period = Period;
  clubSubscription$: Subscription;
  pathUrl: string;
  BookingCardConfig = BookingCardConfig;
  env;
  ElementPosition = ElementPosition;

  constructor(
    private modalService: ModalService,
    private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
    this.pathUrl = this.environmentService.getEnvFile().pathFiles;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.clubSubscription$) {
      this.clubSubscription$.unsubscribe();
    }
  }

  getDuration(): number {
    let duration;
    const start = moment(this.booking.startAt);
    const end = moment(this.booking.endAt);

    duration = end.diff(start, 'minutes');
    return duration;
  }

  async openBooking() {
    if ("activityType" in this.booking && (this.booking.activityType === 'lesson' || this.booking.activityType === 'event')) {
      this.modalService.courseDetailsModal(ClassDetailComponent, this.booking, this.userMe).then(mod => {
        mod.onDidDismiss().then(() => {
          this.reload.emit(true)
        });
      });
    } else {
      await this.modalService.presentBookingDetailmodal(BookingDetailComponent, this.booking['@id']).then(mod => {
        mod.onDidDismiss().then((data) => {
          if(data.data['refresh'] && data.data['refresh'] === true) {
            this.reload.emit(true);
          }
        });
      });
    }
  }
}
