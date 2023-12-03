import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Club } from 'src/app/shared/models/club';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent implements OnInit, OnDestroy {
  clubSubscription$: Subscription;
  club: Club;

  constructor(
    private socialSharing: SocialSharing,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    /* this.clubSubscription$ = this.store.pipe(
      select(getCurrentClub),
      map(club => {
        return {...club, universalLink: 'test'};
      })
    )
    .subscribe( club => {
      this.club = club;
    }); */
  }

  ngOnDestroy(): void {
    /* if (this.clubSubscription$ !== undefined) {
      this.clubSubscription$.unsubscribe();
    } */
  }

  shareClub() {
    let message = this.translateService.instant('match_share_message').replace('%clubName%', this.club.name);

    message = message.replace('%link%', this.club.universalLink);
    this.sendMessage(message);
  }

  sendMessage(message) {
    this.socialSharing.share(message, this.translateService.instant('match_share_subject'));
  }

}
