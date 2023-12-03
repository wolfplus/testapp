import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ClubMatch } from '../match.model';
import { MatchActions } from '../store';
import { MatchState } from '../store/match.reducer';

@Component({
  selector: 'app-match-cancel',
  templateUrl: './match-cancel.component.html',
  styleUrls: ['./match-cancel.component.scss'],
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
export class MatchCancelComponent implements OnInit, AfterViewInit {
  @Input() match: ClubMatch;
  @Input() userIsOrganizer: boolean;

  @Output() closeCancelMatchModal = new EventEmitter();
  @Output() cancelMatch = new EventEmitter();

  MatchCardConfig = MatchCardConfig;

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private translate: TranslateService,
    private matchStore: Store<MatchState>,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    // TODO: check if it works with emulator. If so implement it everywhere needed
    this.platform.backButton.subscribeWithPriority(101, async () => {
      this.onBackBtnClicked();
    });
  }

  ngAfterViewInit() {

  }

  onBackBtnClicked() {
    this.closeCancelMatchModal.emit();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'alert_cancellation',
      header: this.translate.instant('match_cancelation_organizer_warning_title'),
      message: this.translate.instant('match_cancelation_organizer_warning_text'),
      buttons: [
        {
          text: this.translate.instant('cancel'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translate.instant('alert_confirm'),
          handler: () => {
            this.cancelParticipation();
          }
        }
      ]
    });

    await alert.present();
  }

  onCancelParticipationClicked() {
    this.presentAlertConfirm();
  }

  cancelParticipation() {
    this.loaderService.presentLoading();
    this.matchStore.dispatch(MatchActions.deleteMatch({id: this.match.id}));
    this.loaderService.dismiss();
    this.closeCancelMatchModal.emit(true);
  }
}
