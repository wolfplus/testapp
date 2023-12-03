import {Component, Input, OnInit} from '@angular/core';
import {Notification} from '../../../shared/models/notification';
import {ClubMatch} from '../../../matches/match.model';
import {MatchService} from '../../../matches/match.service';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import {ModalService} from '../../../shared/services/modal.service';
import {select, Store} from "@ngrx/store";
import {getCurrentClub} from "../../../club/store";
import {tap} from "rxjs/operators";
import * as moment from "moment";
import {ClubState} from "../../../club/store/club.reducers";
import { PlayerComponent } from 'src/app/player/player.component';

@Component({
  selector: 'app-match-invitation',
  templateUrl: './match-invitation.component.html',
  styleUrls: ['./match-invitation.component.scss']
})
export class MatchInvitationComponent implements OnInit {
  @Input() notification: Notification;
  @Input() club: any;
  match: ClubMatch = null;
  MatchCardConfig = MatchCardConfig;

  constructor(
      private matchService: MatchService,
      private clubStore: Store<ClubState>,
      private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.clubStore.pipe(
        select(getCurrentClub),
        tap(club => {
          this.notification.createdAt = moment(this.notification.createdAt).tz(club.timezone).format('YYYY-MM-DD HH:mm:ss');
        })
    ).subscribe();
    this.matchService.getMatch(this.notification.targetId).subscribe(data => {
      this.match = data;
    });
  }
  showPlayer() {
    this.modalService.playerModal(PlayerComponent, this.notification.userClientRequester['@id']);
  }
}
