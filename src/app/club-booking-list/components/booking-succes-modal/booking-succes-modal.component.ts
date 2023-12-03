import { Component, Input, OnInit } from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';

import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {GoogleTagManagerService} from "angular-google-tag-manager";
import * as moment from "moment/moment";
import * as ics from "ics";
import {Calendar} from "@awesome-cordova-plugins/calendar/ngx";

@Component({
  selector: 'app-booking-succes-modal',
  templateUrl: './booking-succes-modal.component.html',
  styleUrls: ['./booking-succes-modal.component.scss']
})
export class BookingSuccesModalComponent implements OnInit {
  @Input() bookingIRI: any;
  @Input() booking: any;
  @Input() club: any;
  @Input() msgCourse: any;

  env;

  constructor(
    private modalController: ModalController,
    public environmentService: EnvironmentService,
    private gtmService: GoogleTagManagerService,
    private platform: Platform,
    private calendar: Calendar,
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit(): void {
    if(this.env.marqueBlanche.whiteLabelId === "52b36ed5-49e0-4ff3-9540-98470d34fefd") {
      const gtmTag = {
        event: 'action',
        pageName: 'booking created: ' + this.bookingIRI
      };

      this.gtmService.pushTag(gtmTag);
    }
  }

  onScreenTapped() {
    this.modalController.dismiss({createMatch: false, bookingIRI: this.bookingIRI});
  }

  goCreateMatch() {
    this.modalController.dismiss({createMatch: true});
  }

  async addToCalendar() {
    const address = (this.club.address ? this.club.address.join(", ") : '') + this.club.city + ", "  + this.club.zipCode;

    if (this.platform.is('ios') || this.platform.is('android')) {
      this.calendar.createEventInteractively(
          this.club.name + ' - ' + moment(this.booking.startAt).format('YYYY-MM-DD HH:mm'), // title
          address, // location
          undefined,
          new Date(moment(this.booking.startAt).tz(this.club.timezone).format()),
          new Date(moment(this.booking.endAt).tz(this.club.timezone).format() )
      );
    } else {
      const event = {
        start: [Number(moment(this.booking.startAt).tz(this.club.timezone).format('YYYY')), Number(moment(this.booking.startAt).tz(this.club.timezone).format('M')), Number(moment(this.booking.startAt).tz(this.club.timezone).format('D')), Number(moment(this.booking.startAt).tz(this.club.timezone).format('HH')), Number(moment(this.booking.startAt).tz(this.club.timezone).format('mm'))],
        end: [Number(moment(this.booking.endAt).tz(this.club.timezone).format('YYYY')), Number(moment(this.booking.endAt).tz(this.club.timezone).format('M')), Number(moment(this.booking.endAt).tz(this.club.timezone).format('D')), Number(moment(this.booking.endAt).tz(this.club.timezone).format('HH')), Number(moment(this.booking.endAt).tz(this.club.timezone).format('mm'))],
        title: this.club.name + ' - ' + moment(this.booking.startAt).format('YYYY-MM-DD HH:mm'),
        location: address,
      };

      await this.handleDownload(event);
    }
  }

  async handleDownload(event) {
    const filename = this.club.name + moment(this.booking.startAt).format('YYYY-MM-DD HH:mm') + '.ics';
    const file = await new Promise((resolve, reject) => {
      ics.createEvent(event, (error, value) => {
        if (error) {
          reject(error);
        }

        resolve(new File([value], filename, { type: 'text/calendar' }));
      });
    });
    // @ts-ignore
    const url = URL.createObjectURL(file);

    // trying to assign the file URL to a window could cause cross-site
    // issues so this is a workaround using HTML5
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  }

}
