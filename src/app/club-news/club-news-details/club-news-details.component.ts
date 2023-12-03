import { Component, Input, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { ClubNewsService } from 'src/app/shared/services/news/club-news.service';

import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Component({
  selector: 'app-club-news-details',
  templateUrl: './club-news-details.component.html',
  styleUrls: ['./club-news-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClubNewsDetailsComponent implements OnInit, OnDestroy {
  @Input() newsIri: string;

  news: any;
  env;
  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  publishedOnText = this.translateService.instant('published_on');
  showSkeleton: boolean;
  subscription: Subscription;
  shareMessage: string;
  shareSubject: string;
  pathName: string = this.environmentService.getEnvFile().marqueBlanche.pathName;

  constructor(
    private clubNewsService: ClubNewsService,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    public sanitizer: DomSanitizer,
    private environmentService: EnvironmentService
  ) {
    this.env = environmentService.getEnvFile();
  }

  ngOnInit() {
    this.shareMessage = this.translateService.instant('club_news_share_message');
    this.shareSubject = this.translateService.instant('club_news_share_subject');
    this.news = {
      mainPhoto: {
        contentUrl: `/assets/mb/${this.pathName}/account.jpg`
      },
      publicationStartDate: ""
    };
    this.showSkeleton = true;
    this.subscription = this.clubNewsService.getNewsDetails(this.newsIri)
      .pipe(
        tap(news => {
          this.news = news;
          this.showSkeleton = false;
        })
      )
      .subscribe();
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
