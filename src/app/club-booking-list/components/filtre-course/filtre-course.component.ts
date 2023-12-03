import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { BookingService } from 'src/app/shared/services/booking/booking.service';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import { FiltersCoursePage } from './filters/filters.page';

@Component({
  selector: 'app-filtre-course',
  templateUrl: './filtre-course.component.html',
  styleUrls: ['./filtre-course.component.scss'],
})
export class FiltreCourseComponent implements OnInit {
  @Input() openningHour: string;
  @Input() closingHour: string;
  @Input() selectedTime: any;
  @Input() clubId: string;
  @Output() setTimes = new EventEmitter();
  @Output() reload = new EventEmitter();
  @Input() coursSelected: any;
  @Input() filterSelected: any;
  
  startTime: any;
  endTime: any;
  selectedActivity: string;
  activities: any = [];
  clubIdStorage: any;

  constructor(
    private modalService: ModalService,
    private bookingService: BookingService,
    private clubIdStorageService: ClubIdStorageService
  ) {

  }

  async ngOnInit() {
    this.clubIdStorage = await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
    this.activities = await this.bookingService.getActivities(this.clubIdStorage).toPromise();
  }

  openFilterModal() {
    this.modalService.filterCourseSearchModal(FiltersCoursePage, this.clubId, this.activities, this.filterSelected).then(mod => {
      mod.onDidDismiss().then( data => {
        this.reload.emit(data);
      });
    });
  }

}
