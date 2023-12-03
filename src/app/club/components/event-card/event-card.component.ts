import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalService } from 'src/app/shared/services/modal.service';
import { EventDetailComponent } from '../../containers/event-detail/event-detail.component';
import { ClubEvent } from '../../models/club-event';
import { loadSelectedClubEvent } from '../../store/actions/club.actions';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input() clubEvent: ClubEvent;
  @Input() imgWidth: string;

  /* TODO: add variables */
  levelsColors = [
      {
        text: "inherit",
        border: "#EAEBEF",
      },
      {
        text: "#7FECDF",
        border: "#7FECDF",
      },
      {
        text: "#F8DC35",
        border: "#F8DC35",
      }
  ];

  constructor(
    private modalService: ModalService,
    private store: Store<ClubState>
  ) {}

  ngOnInit() {
  }

  participate() {
    /* TODO add modal to event register form */
    this.store.dispatch(loadSelectedClubEvent({eventId: this.clubEvent.id}));
    this.modalService.presentClubEventDetailModal(EventDetailComponent, this.clubEvent.id);
  }

}
