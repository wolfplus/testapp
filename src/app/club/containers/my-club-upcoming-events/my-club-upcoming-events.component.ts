import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ClubEvent } from '../../models/club-event';
import { getCurrentClubEvents, getCurrentClubEventsState } from '../../store';
import { ClubState } from '../../store/club.reducers';
import { ClubAllEventsComponent } from '../club-all-events/club-all-events.component';

@Component({
  selector: 'app-my-club-upcoming-events',
  templateUrl: './my-club-upcoming-events.component.html',
  styleUrls: ['./my-club-upcoming-events.component.scss']
})
export class MyClubUpcomingEventsComponent implements OnInit {
  @Input() cardWidth: string;
  title$ = this.translator.get("events_to_come");
  events$: Observable<ClubEvent[]>;
  eventsAreLoaded$: Observable<boolean>;

  constructor(
    private clubStore: Store<ClubState>,
    private modalService: ModalService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    // TODO: implement data from api
    this.events$ = this.clubStore.pipe(
      select(getCurrentClubEvents)
    );

    this.eventsAreLoaded$ = this.clubStore.pipe(
      // TODO: remove delay after test
      delay(3000),
      select(getCurrentClubEventsState)
    );
  }

  showAllEvents() {
    this.modalService.presentClubEventsModal(ClubAllEventsComponent, this.events$);
  }

}
