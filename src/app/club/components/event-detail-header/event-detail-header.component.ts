import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClubMatch } from 'src/app/matches/match.model';

import { ClubEvent } from '../../models/club-event';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-event-detail-header',
  templateUrl: './event-detail-header.component.html',
  styleUrls: ['./event-detail-header.component.scss']
})
export class EventDetailHeaderComponent implements OnInit {
  @Input() eventImageUrl: string;
  @Input() event: ClubMatch | ClubEvent | any;
  @Input() showShareBtn = true;
  @Output() backButtonClicked = new EventEmitter();
  @Output() shareButtonClicked = new EventEmitter();

  /* TODO: add img url */
  baseUrl = this.environmentService.getEnvFile().domainAPI;

  constructor(
    private environmentService: EnvironmentService) { }

  ngOnInit() {
  }

  onShareButtonClicked() {
    this.shareButtonClicked.emit();
  }

  goBack() {
    this.backButtonClicked.emit();
  }
}
