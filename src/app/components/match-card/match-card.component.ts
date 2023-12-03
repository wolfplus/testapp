import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatchDetailComponent } from 'src/app/matches/match-detail/match-detail.component';
import { ClubMatch } from 'src/app/matches/match.model';
import { MatchCardConfig } from 'src/app/shared/enums/match-card-config';
import { Geolocation } from 'src/app/shared/models/geolocation';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DateUtil } from 'src/app/shared/Tools/date-utils';
import { getDurationInMinutes } from 'src/utils/getDurationInMinutes';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { SignComponent } from 'src/app/modal/auth/sign/sign.component';
import { ColorStyle, FontSize } from 'src/app/shared/models/style';
import {SignInComponent} from "../../modal/auth/sign-in/sign-in.component";
import {getCurrentMe} from "../../account/store";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card-v2.component.html',
  styleUrls: ['./match-card-v2.component.scss']
})
export class MatchCardComponent implements AfterViewInit, OnInit {
  @Input() match: ClubMatch;
  @Input() userId: string;
  //@Input() userLocation$: Observable<Geolocation> = of({ latitude: null, longitude: null });
  @Input() config = MatchCardConfig.FULL;
  @Input() stopClick = false;
  @Input() isEditable = true;
  @Output() cardClicked = new EventEmitter();
  @Output() reloadMatches = new EventEmitter();

  env = this.environmentService.getEnvFile();
  clubLocation: Geolocation;
  clubLocationSub$ = new BehaviorSubject<Geolocation>({ latitude: null, longitude: null });
  clubLocation$: Observable<Geolocation> = this.clubLocationSub$.asObservable();

  startAt: moment.Moment;
  endAt: moment.Moment;
  duration: number;
  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  MatchCardConfig = MatchCardConfig;
  organizerGuestsNumber: number;
  durationIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="72.041" height="44.511" viewBox="0 0 72.041 44.511"><path d="M63.125,11.617C57.507,6.445,53.61-.9,42.735.091,38.491.48,34.917,2.7,31.385,4.524,20.946,9.917,9.795,15.967,0,21.015a131.676,131.676,0,0,0,10.993,11.7c10.64-5.644,21.944-12.206,32.982-18.086C49.461,11.71,56.29,8.942,63.125,11.617Zm-30.5-6.029L37.946,2.7l8.107,8.639-5.428,2.793Z" transform="translate(0 0)"/><path d="M59.55,16.587c-4.518.4-8.239,2.621-11.881,4.61C36.756,27.159,26.046,32.943,15.753,38.929v8.688C19.82,45.608,24,43.378,28.165,41.058c4.12-2.3,8.134-5.025,12.59-6.739.777,9.86,7.077,15.6,17.2,14.719,9.179-.8,17.753-8.3,18.441-17.379C77.139,21.871,69.41,15.72,59.55,16.587Z" transform="translate(-4.404 -4.615)"/><path d="M.177,39.493l3.9-2.3L0,33.11Z" transform="translate(0 -9.257)"/><path d="M4.944,40.493.558,42.854l9,9.383L9.682,45.1C8.086,43.625,4.944,40.493,4.944,40.493Z" transform="translate(-0.156 -11.321)"/><path d="M46.519,44.826A6.64,6.64,0,0,0,49,47.308a9.325,9.325,0,0,1-.709-3.37A5.361,5.361,0,0,0,46.519,44.826Z" transform="translate(-13.006 -12.284)"/><path d="M51.288,6.512,48.866,7.827l5.765,6.157L57.1,12.71Z" transform="translate(-13.662 -1.82)"/></svg>';

  ColorStyle = ColorStyle;
  FontSize = FontSize;
  
  constructor(
    private modalController: ModalController,
    private modalService: ModalService,
    private dateUtil: DateUtil,
    private accountStore: Store<any>,
    private environmentService: EnvironmentService
  ) {
    this.env = environmentService.getEnvFile();
  }

  ngOnInit() {
    this.startAt = this.dateUtil.getLocaleDateFromClubTimeZone(this.match.startAt, moment.tz.guess(), this.match.club.timezone);
    this.endAt = this.dateUtil.getLocaleDateFromClubTimeZone(this.match.endAt, moment.tz.guess(), this.match.club.timezone);
  }

  ngAfterViewInit() {
    if (this.match.participants !== undefined && this.match.participants !== null) {
      this.organizerGuestsNumber = this.match.participants
        .filter( participant => {
          if (participant.addedBy !== (undefined || null)) {
            return participant.addedBy.id === this.match?.userClient?.id;
          }
          return false;
        }).length;
    }

    if (this.match.duration === undefined) {
      this.duration = getDurationInMinutes(this.match.startAt, this.match.endAt);
    } else {
      this.duration = this.match.duration;
    }

    if (this.match.club !== undefined) {

      if (this.match.club.longitude !== undefined && this.match.club.latitude !== undefined) {
        this.clubLocationSub$.next({ latitude: this.match.club.latitude, longitude: this.match.club.longitude });
      }
    }
  }

  setHeaderBgImg() {
    let url = "";
    if ( this.match.club.mainPhoto && this.match.club.mainPhoto.contentUrl) {
      url = this.baseUrl + this.match.club.mainPhoto.contentUrl;
    } else {
      url = 'assets/mb/' + this.env.marqueBlanche.pathName + '/' + 'club_default.png';
    }

    return {
      background: `linear-gradient(
          1deg,
          #FFFFFF00 0%,
          #00000063 67%,
          #0000006E 100%
        ) 0% 0% no-repeat,
        url(${url})`,
      'background-repeat': 'no-repeat',
      'background-clip': 'content-box',
      'background-position': 'center',
      'background-size': 'cover',
    };
  }

  onCardClicked() {
    this.accountStore.select(getCurrentMe)
      .subscribe(data => {
        if (data === undefined) {
          this.modalService.signModal(SignComponent);
        } else {
          this.presentMatchDetails(this.match.id, this.match.activity.id, this.isEditable)
            .then( modal => {
              modal.present();
              modal.onDidDismiss()
                .then( returnedData => {
                  if (returnedData.data) {
                    if (returnedData.data['reload'] === true) {
                      this.reloadMatches.emit(true);
                    }
                  }
                });
            });
        }
      });
  }

  async presentMatchDetails(matchId: string, matchActivityId: string, isEditable) {
    return await this.modalController
      .create({
        component: this.userId ? MatchDetailComponent : SignInComponent,
        cssClass: 'match-details-class',
        componentProps: {
          matchId,
          matchActivityId,
          isEditable,
          routeOpen: false
        },
        animated: true
      });
  }
}
