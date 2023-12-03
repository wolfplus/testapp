import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { TranslateService } from '@ngx-translate/core';
import { ClubMatch } from 'src/app/matches/match.model';
import { SelectFriendsComponent, SelectFriendsConfig } from '../friends/select-friends/select-friends.component';
import * as moment from 'moment';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-match-share',
  templateUrl: './match-share.component.html',
  styleUrls: ['./match-share.component.scss'],
  animations: [
    trigger(
      'fadeInFadeOut',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.5s ease-in',
                    style({ opacity: 0.2 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 0.2}),
            animate('5s ease-out',
                    style({ opacity: 0 }))
          ]
        )
      ]
    ),
    trigger(
      'slideInSlideOut',
      [
        transition(
          ':enter',
          [
            style({ bottom: '-100%' }),
            animate('.5s ease-in',
                    style({ bottom: 0 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ bottom: 0}),
            animate('1s ease-out',
                    style({ bottom: '-100%' }))
          ]
        )
      ]
    )
  ]
})
export class MatchShareComponent implements AfterViewInit, OnDestroy {
  @Input() match: ClubMatch;
  @Input() userId: string;
  @Input() activityLevels: Array<any>;
  @Output() closeShareMatchModal = new EventEmitter();

  constructor(
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private socialSharing: SocialSharing,
    private clipboard: Clipboard,
    private platform: Platform,
    private toastService: ToastService  ) { }

  ngAfterViewInit() {
  }

  ngOnDestroy() {

  }

  addOrInviteFriends(action) {

    this.modalCtrl.create({
      component: SelectFriendsComponent,
      cssClass: 'friends-select-class',
      componentProps: {
        isCreationMode: false,
        matchIRI: this.match['@id'],
        attenders: this.match.participants,
        selectedFriends: this.match.participants
          .filter( participant => (participant.addedBy === this.userId && (participant.user !== undefined && participant.user !== null))),
        maxAttenders: 1000,
        activityId: this.match.activity.id,
        activityLevels: this.activityLevels,
        matchLevels: this.match.activityLevels,
        levelRequired: this.match.activityLevelRequired !== undefined ? this.match.activityLevelRequired : false,
        action: action === 'add' ? 'add' : 'invite',
        config: SelectFriendsConfig.MATCH_UPDATE
      }
    }).then(mod => {
      mod.present();
      mod.onDidDismiss()
        .then(() => {
          // this.attenders = data.data;

        });
    });
  }

  shareMatchVia() {
    /* let loader = this.loading.create({
      content: this.translateService.instant('match.loading.share_details'),
    });
    loader.present(); */
    const message = this.generateShareMessage(this.match);
    // alert("message :" + message);
    // this.socialSharing.share(message, this.translateService.instant('match_share_subject'));

    this.socialSharing.shareWithOptions({
      message,
      // subject: this.translateService.instant('match_share_subject'),
      // url: this.match.deepLink
    }).then(() => {
      // Sharing via email is possible
    }).catch(() => {
      // Sharing via email is not possible
    });
  }

  generateShareMessage(match) {
    let message = this.translateService.instant('match_share_message');
    message = message.replace('%sport%', match['activity']['name']);
    message = message.replace('%date%', moment(match['startAt']).format('D MMMM YYYY, HH:mm'));
    message = message.replace('%location%', (match['club']['name'] ?
                                            match['club']['name'] : '') + ' ' + match['club']['address'][0] + ' ' + match['club']['city']);
    message = message.replace('%link%', match['deepLink']);
    return message;
  }

  copyMatchLinkTablet() {
      if (this.match.deepLink !== undefined) {
        this.copyMessage(this.match.deepLink);
        this.toastService.presentSuccess(this.translateService.instant('link_copied'), 'top');
      }
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  copyMatchLink() {
    this.platform.ready().then( () => {
      if (this.match.deepLink !== undefined) {
        this.clipboard.copy(this.match.deepLink)
          .then( () => {
            this.toastService.presentSuccess(this.translateService.instant('link_copied'), 'top');
          });
      }
    });
  }

  onBackBtnClicked() {
    this.closeShareMatchModal.emit("");
  }

}
