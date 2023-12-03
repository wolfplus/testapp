import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MatchService } from '../match.service';
import { MatchActions } from '../store';
import { MatchState } from '../store/match.reducer';
import { AppState } from 'src/app/state/app.state';
import { reloadMyMatches } from 'src/app/state/actions/myMatches.actions';
@Component({
  selector: 'app-match-join',
  templateUrl: './match-join.component.html',
  styleUrls: ['./match-join.component.scss'],
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
export class MatchJoinComponent implements OnInit, AfterViewInit {
  @Input() user: User;
  @Input() matchIRI: string;
  @Input() userIsOrganizer: boolean;
  @Input() nbOfTickets: number;
  @Input() maxTickets: number;
  @Input() bookedTickets: number;
  @Input() availableTickets: number;
  @Input() participantsList: Array<any>;
  @Input() canCancel: boolean;
  @Input() conditionCancelHours: number;

  @Output() closeJoinMatchModal = new EventEmitter();
  @Output() registerNbOfTickets = new EventEmitter();

  userIsAlreadyAParticipant = false;

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private translate: TranslateService,
    private matchService: MatchService,
    private matchStore: Store<MatchState>,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // TODO: check if it works with emulator. If so implement it everywhere needed
    this.platform.backButton.subscribeWithPriority(101, async () => {
      this.onBackBtnClicked();
    });
  }

  ngAfterViewInit() {
    if (this.nbOfTickets > 0) {
      this.userIsAlreadyAParticipant = true;
    } /* else {
      this.nbOfTickets += 1;
    } */
    if (this.maxTickets && this.bookedTickets) {
      this.availableTickets = this.maxTickets - this.bookedTickets;
    }
  }

  increment() {
    if (this.availableTickets > 0) {
      this.nbOfTickets += 1;
      this.availableTickets -= 1;
    } else {
      return;
    }
  }

  decrement() {
    if (this.nbOfTickets > 0) {
      this.nbOfTickets--;
      this.availableTickets++;
    } else {
      return;
    }
  }

  onBackBtnClicked() {
    this.closeJoinMatchModal.emit(false);
  }

  onValidationBtnClicked() {
    // this.registerNbOfTickets.emit(this.nbOfTickets);
    let participantsData;

    if (this.userIsAlreadyAParticipant) {
      let userParticipantIRI;
      const userParticipant = this.participantsList
        .filter(user => user.user !== undefined &&  user.user !== null)
        .find( user => user.user.id === this.user.id);
      if (userParticipant !== undefined) {
        userParticipantIRI = userParticipant['@id'];
      }
      participantsData = {
        match: this.matchIRI,
        id: userParticipantIRI,
        user: this.user.id,
        accompanyingParticipants : []
      };
      for (let i = 1; i < this.nbOfTickets; i++) {
        participantsData.accompanyingParticipants.push({customData: []});
      }
      this.loaderService.presentLoading();
      this.matchService.updateParticipants(userParticipantIRI, participantsData)
        .pipe(
          tap( match => {
            if (match !== undefined) {
              let message;
              message = this.translate.instant('match_participation_update_success');
              this.loaderService.dismiss();
              this.toastService.presentSuccess(message);
              // const iriAsArray = this.matchIRI.split('/');
              // this.matchStore.dispatch(MatchActions.loadMatch({matchId: iriAsArray[iriAsArray.length - 1]}));
              this.store.dispatch(reloadMyMatches({payload: true}));
              this.closeJoinMatchModal.emit(true);
            } else {
              // TODO: display error message
              this.loaderService.dismiss();
              let message;
              message = this.translate.instant('match_participation_update_error');
              this.toastService.presentError(message);
            }
          })
        )
        .subscribe();

    } else {
      participantsData = {
        match: this.matchIRI,
        user: this.user['@id']
      };
      if (this.nbOfTickets > 1) {
        participantsData['accompanyingParticipants'] = [];
        for (let i = 1; i < this.nbOfTickets; i++) {
          participantsData.accompanyingParticipants.push({customData: []});
        }
      }
      this.loaderService.presentLoading();
      this.matchService.addParticipants(participantsData).pipe(
        tap( match => {
          if (match !== undefined) {
            this.loaderService.dismiss();
            let message;
            if (participantsData.length  > 1) {
              message = this.translate.instant('add_attenders_success');
            } else {
              message = this.translate.instant('add_attender_success');
            }
            this.toastService.presentSuccess(message);
            // const iriAsArray = this.matchIRI.split('/');
            // this.matchStore.dispatch(MatchActions.loadMatch({matchId: iriAsArray[iriAsArray.length - 1]}));
            this.store.dispatch(reloadMyMatches({payload: true}));
            this.closeJoinMatchModal.emit(true);
          } else {
            // TODO: display error message
            this.loaderService.dismiss();
            let message;
            if (participantsData.length  > 1) {
              message = this.translate.instant('add_attenders_error');
            } else {
              message = this.translate.instant('add_attender_error');
            }
            this.toastService.presentError(message);
          }
        })
      )
      .subscribe();
    }
  }

  onCancelParticipationClicked() {
    if(!this.canCancel) {
      this.toastService.presentError('error_cancel_condition', 'bottom', true,{ hours: this.conditionCancelHours })
      return;
    }
    // this.nbOfTickets = 0;
    this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'alert_cancellation',
      header: this.userIsOrganizer ? this.translate.instant('match_cancelation_organizer_warning_title') : this.translate.instant('participation_cancellation'),
      message: this.userIsOrganizer ? this.translate.instant('match_cancelation_organizer_warning_text') : this.translate.instant('match_cancelation_warning_text'),
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

  cancelParticipation() {
    this.loaderService.presentLoading();
    const iriAsArray = this.matchIRI.split('/');
    if (this.userIsOrganizer) {
      this.matchStore.dispatch(MatchActions.deleteMatch({id: iriAsArray[iriAsArray.length - 1]}));
      this.loaderService.dismiss();
      this.closeJoinMatchModal.emit(true);
    } else {
      const userParticipantIRI = this.participantsList
        .filter(user => user.user !== undefined &&  user.user !== null)
        .find( user => user.user.id === this.user.id)['@id'];
      this.matchService.deleteParticipation(userParticipantIRI)
        .pipe(
          tap( () => this.loaderService.dismiss())
        )
        .subscribe();
      this.closeJoinMatchModal.emit(true);
    }
  }
}
