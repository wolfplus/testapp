import { Component, OnInit } from '@angular/core';
import {ClubService} from '../../../shared/services/club/club.service';
import {filter, map, tap} from 'rxjs/operators';
import {ModalService} from '../../../shared/services/modal.service';
import { ChoiceActivityComponent } from 'src/app/modal/choice-activity/choice-activity.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  activities;
  showSkeleton: boolean;
  constructor(
    private clubService: ClubService,
    private modalService: ModalService  ) {
    this.showSkeleton = true;
  }

  ngOnInit() {
    this.clubService.getActivities()
      .pipe(
        filter( activities => activities !== undefined && activities['hydra:member'] !== undefined),
        map( activities => activities['hydra:member']),
        tap( activities => {
          this.showSkeleton = false;
          this.activities = activities;
        })
      )
      .subscribe();
  }

  showMore() {
    this.modalService.choiceActivityModal(ChoiceActivityComponent).then();
  }
}
