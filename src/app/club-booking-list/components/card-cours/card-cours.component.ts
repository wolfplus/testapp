import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment-timezone';
import {ModalService} from '../../../shared/services/modal.service';
import {SlotBlock} from '../../../shared/models/slot-block';
import {animate, style, transition, trigger} from '@angular/animations';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { SignComponent } from 'src/app/modal/auth/sign/sign.component';
import { ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import {tap} from "rxjs/operators";
import { ClassDetailComponent } from '../class-detail/class-detail.component';
import {getCurrentMe} from "../../../account/store";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-card-cours',
  templateUrl: './card-cours.component.html',
  styleUrls: ['./card-cours.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0, height: 48}),
            animate('0.4s ease-out',
              style({ opacity: 1, height: 96 }))
          ]
        )
      ]
    )
  ]
})
export class CardCoursComponent implements OnInit {

  @Input() oneCourse: any;
  @Input() showDate: boolean;
  @Output() reloadCourse = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  guid:any;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private platform: Platform,
    private modalCtrl: ModalController,
    private modalService: ModalService,
    private accountStore: Store<any>,
    private environmentService: EnvironmentService
  ) {
    this.showSkeletonSlot = true;
    this.guid = this.route.snapshot.queryParams.guid;
    this.platform.backButton.subscribeWithPriority(98, async () => {
      this.dismiss();
    });
  }

  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  showSkeletonSlot: boolean;
  showFirstOrNext = null;
  userMe: any;
  participated = '';
  modifiedActivity: any;
  filteredSlots: SlotBlock[];

  ngOnInit() {
  }

  setHeaderBgImg() {
    let url = "";
    if ( this.oneCourse.timetableBlockPrice.mainPhoto != null) {
      url = this.baseUrl +  this.oneCourse.timetableBlockPrice.mainPhoto.contentUrl;
    } else {
      url = this.baseUrl +  this.oneCourse.club.mainPhoto.contentUrl;
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

  getDiff() {
    const diffMinutes = moment(this.oneCourse.endAt).diff(moment(this.oneCourse.startAt), 'minutes');
    if (diffMinutes < 60) {
      return diffMinutes + 'min';
    } else if ((parseInt('' + (diffMinutes / 60), null) * 60) === diffMinutes) {
      return (diffMinutes / 60) + 'h';
    } else {
      return parseInt('' + (diffMinutes / 60), null) + 'h' + (diffMinutes - (parseInt('' + (diffMinutes / 60), null) * 60));
    }
  }

  getDiffInMin() {
    return moment(this.oneCourse.endAt).diff(moment(this.oneCourse.startAt), 'minutes') + ' minutes';
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  closeModalRefresh(): void {
    this.onClose.emit(true);
}

  async openModal() {
    this.loaderService.presentLoading().then();
    this.accountStore.select(getCurrentMe).pipe(tap(user => {
      if (user) {
        this.userMe = user;
        this.modalService.courseDetailsModal(ClassDetailComponent, this.oneCourse, this.userMe, this.participated).then(mod => {
          mod.onDidDismiss().then( () => {
            this.closeModalRefresh();
            this.reloadCourse.emit();
            this.loaderService.dismiss().then();
          });
        });
      } else {
        this.modalCtrl
            .create({
              component: SignComponent,
              cssClass: 'sign-class'
            })
            .then(mod => {
              mod.present().then(() => {
                mod.onDidDismiss().then(async () => {
                  this.accountStore.select(getCurrentMe).pipe(tap(data => {
                    this.userMe = data;
                  }));
                });
              });
            });
      }
    })).subscribe();
  }
}
