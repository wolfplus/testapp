import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Club} from '../../../shared/models/club';

import {Activity} from '../../../shared/models/activity';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-header-club',
  templateUrl: './header-club.component.html',
  styleUrls: ['./header-club.component.scss']
})
export class HeaderClubComponent implements OnInit {

  @Input() club: Club;
  @Input() activities: Array<Activity>;
  @Input() isPreferred: boolean;
  @Output() closeAction = new EventEmitter();
  @Output() changePref = new EventEmitter();
  path = this.environmentService.getEnvFile().pathFiles;

  deepLink: string;
  shareMessage: string;
  shareSubject: string;

  heartColor = 'white';
  constructor(
    private translate: TranslateService,
    private environmentService: EnvironmentService
  ) { }

  ngOnInit() {
    this.shareMessage = this.translate.instant('club_share_message');
    this.shareSubject = this.translate.instant('club_share_subject');
    this.deepLink = this.club.deepLink;
  }
  close() {
    this.closeAction.emit();
  }

  changePreferred() {
    this.changePref.emit();
  }
}
