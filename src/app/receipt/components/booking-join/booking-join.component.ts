import {Component, Input, OnInit} from '@angular/core';
import {Notification} from '../../../shared/models/notification';
import {Booking, BookingCardConfig} from '../../../shared/models/booking';
import {BookingService} from '../../../shared/services/booking/booking.service';
import {ModalService} from '../../../shared/services/modal.service';
import * as moment from "moment";
import { PlayerComponent } from 'src/app/player/player.component';

@Component({
  selector: 'app-booking-join',
  templateUrl: './booking-join.component.html',
  styleUrls: ['./booking-join.component.scss']
})
export class BookingJoinComponent implements OnInit {

  @Input() notification: Notification;
  @Input() club: any;
  booking: Booking = null;
  BookingCardConfig = BookingCardConfig;

  constructor(
      private bookingService: BookingService,
      private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.notification.createdAt = moment(this.notification.createdAt).tz(this.club.timezone).format('YYYY-MM-DD HH:mm:ss');

    this.bookingService.getBooking(this.notification.targetId).subscribe(data => {
      this.booking = data;
    });
  }
  showPlayer() {
    this.modalService.playerModal(PlayerComponent, this.notification.userClientRequester['@id']);
  }
}
