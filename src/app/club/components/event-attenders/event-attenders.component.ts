import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { getPrimaryColor } from 'src/utils/get-primary-color';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-event-attenders',
  templateUrl: './event-attenders.component.html',
  styleUrls: ['./event-attenders.component.scss']
})
export class EventAttendersComponent implements OnInit, AfterViewInit {
  /* TODO: Attender type ? */
  @Input() attenders: Array<any>;
  @Input() maxAttenders: number;
  @Input() eventAttenders: any; // TODO : A GARDER ? KMED

  title$ = this.translator.get('participants');
  baseUrl = this.environmentService.getEnvFile().domainAPI;
  avatarUrl: string;
  avatarBgColor = 'lightGray';

  constructor(private translator: TranslateService,
              private environmentService: EnvironmentService) { }

  ngOnInit() {
    this.avatarBgColor = getPrimaryColor();
  }

  ngAfterViewInit() {
  }

}
