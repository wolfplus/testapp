import { Component, Input, OnInit } from '@angular/core';

import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-last-news-card',
  templateUrl: './last-news-card.component.html',
  styleUrls: ['./last-news-card.component.scss']
})
export class LastNewsCardComponent implements OnInit {
  @Input() clubNews: any;

  env;
  pathUrl: string;

  constructor(
      private environmentService: EnvironmentService
  ) {
    this.env = this.environmentService.getEnvFile();
  }

  ngOnInit() {
    this.pathUrl = this.environmentService.getEnvFile().pathFiles;
  }

}
