import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import { CalendarComponentTypeProperty } from 'ion2-calendar';
import * as moment from "moment";
import {LocaleService} from "../../shared/services/translate/locale.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendarOptions: any;
  type: CalendarComponentTypeProperty;
  selectedDay = null;
  constructor(
      private modalCtrl: ModalController,
      private localeService: LocaleService
  ) {
    this.selectedDay = moment();
  }

  ngOnInit(): void {
    this.calendarOptions = this.localeService.getCalendarOptions();

  }
  onChange() {
    this.close();
  }

  close() {
    this.modalCtrl.dismiss(this.selectedDay).then();
  }
}
