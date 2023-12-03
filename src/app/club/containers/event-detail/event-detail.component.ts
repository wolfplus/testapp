import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ClubEvent } from '../../models/club-event';
import { getSelectedEvent } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: ClubEvent;
  eventId: string;
  eventSubscription$: Subscription;

  constructor(
    private store: Store<ClubState>,
    private platform: Platform,
    public modalCtrl: ModalController
  ) {
    this.platform.backButton.subscribeWithPriority(101, async () => {
      this.dismiss();
    });
  }

  ngOnInit() {
    this.eventSubscription$ = this.store.pipe(
      select(getSelectedEvent)
    )
    .subscribe( event => this.event = event);
  }

  ngOnDestroy() {
    this.eventSubscription$.unsubscribe();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

}
