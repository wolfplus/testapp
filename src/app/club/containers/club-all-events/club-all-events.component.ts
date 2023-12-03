import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ClubEvent } from '../../models/club-event';
import { getClubName } from '../../store';
import { ClubState } from '../../store/club.reducers';

@Component({
  selector: 'app-club-all-events',
  templateUrl: './club-all-events.component.html',
  styleUrls: ['./club-all-events.component.scss']
})
export class ClubAllEventsComponent implements OnInit {
  // @Input('events$') events$: Observable<ClubEvent>;
  @Input() events$: Observable<ClubEvent[]>;
  foo;

  // TODO: add translation
  title$: Observable<string> = this.translate.get('events');
  subtitle$: Observable<string> = this.store.pipe(select(getClubName));

  constructor(
    private translate: TranslateService,
    private store: Store<ClubState>,
    private platform: Platform,
    public modalCtrl: ModalController
  ) {
    this.platform.backButton.subscribeWithPriority(101, async () => {
      this.dismiss();
    });
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

}
