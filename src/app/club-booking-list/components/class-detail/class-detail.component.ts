import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { slideInSlideOut } from 'src/app/animations';
import { ModalService } from 'src/app/shared/services/modal.service';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment-timezone';
import { BookingService } from 'src/app/shared/services/booking/booking.service';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from 'src/app/shared/services/level/level.service';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import {tap} from "rxjs/operators";
import { ClassCommentsModalComponent } from '../class-comments-modal/class-comments-modal.component';
import { CourseBookingComponent } from '../course-booking/course-booking.component';
import {getCurrentMe} from "../../../account/store";
import {Store} from "@ngrx/store";

@Component({
    selector: 'app-class-detail',
    templateUrl: './class-detail.component.html',
    styleUrls: ['./class-detail.component.scss'],
    animations: [
        slideInSlideOut
    ]
})
export class ClassDetailComponent implements OnInit, OnDestroy {

    @Input() booking;
    @Input() userMe;
    @Input() participated;

    imageUrl: string;
    baseUrl: string = this.environmentService.getEnvFile().domainAPI;
    startMessage: any;
    guid: any;
    clubName: any;
    realClient: any;
    description: any;
    client: any;
    env: any;
    isReady = false;
    iconParticipants: any;

    constructor(
        private modalCtrl: ModalController,
        private alertController: AlertController,
        private loaderService: LoaderService,
        private route: ActivatedRoute,
        private platform: Platform,
        private translate: TranslateService,
        private modalService: ModalService,
        public sanitizer: DomSanitizer,
        private levelService: LevelService,
        private accountStore: Store<any>,
        private bookingService: BookingService,
        private accountService: AccountService,
        private clubIdStorageService: ClubIdStorageService,
        private environmentService: EnvironmentService
    ) {
        this.guid = this.route.snapshot.queryParams.guid;
        this.clubName = this.route.snapshot.queryParams.name;
        this.env = this.environmentService.getEnvFile();
        this.platform.backButton.subscribeWithPriority(99, async () => {
            this.dismiss(false);
        });
    }

    ngOnDestroy(): void {
    }

    async ngOnInit() {
        this.guid =  await this.clubIdStorageService.getClubId();
        this.loaderService.dismiss();
        this.imageUrl = this.baseUrl +  (
            this.booking.timetableBlockPrice.mainPhoto != null ?
                this.booking.timetableBlockPrice.mainPhoto.contentUrl :
                this.booking.club.mainPhoto.contentUrl
        );
        this.accountStore.select(getCurrentMe).pipe(tap(async data => {
            this.userMe = data;
            this.client = await this.levelService.get().toPromise();
            if (this.userMe) {
                this.realClient = await this.accountService.getClubsClient(this.userMe.id, [this.guid]).toPromise();
            }
            this.description = await this.bookingService.get(this.booking.timetableBlockPrice['@id']).toPromise();
            this.iconParticipants = await this.bookingService.getIconPraticipants(this.booking['@id']).toPromise();


            this.bookingService.get(this.booking["@id"]).pipe(tap(booking => {
                this.booking = booking;

                this.checkPriority();

                if (
                    this.booking.registrationTimeBeforeStart !== null &&
                    this.booking.registrationTimeBeforeStart !== 0 &&
                    (Number(Date.now()) < (Number(new Date(this.booking.startAt)) - this.booking.registrationTimeBeforeStart * 1000))
                ) {
                    this.startMessage = new Date(Number(new Date(this.booking.startAt)) - this.booking.registrationTimeBeforeStart * 1000);
                }
            })).subscribe();
        })).subscribe();
    }


    async canceledAttender() {
        const alert = await this.alertController.create({
            header: this.translate.instant('title_alert_booking_participant_cancelation'),
            message: this.translate.instant('message_alert_participant_cancelation'),
            buttons: [
                {
                    text: this.translate.instant('yes'),
                    handler: () => {
                        this.cancelBooking();
                    }
                }, {
                    text: this.translate.instant('no')
                }
            ]
        });
        await alert.present();
    }

    checkPriority(_notyet?) {
        // let userHere: any;

        this.bookingService.getBookingParticipants(this.booking['@id'], this.userMe.id).subscribe(
            (response) => {
                // if (response['hydra:member']) {
                //     if (response['hydra:member'][0]) {
                //         userHere = response['hydra:member'][0];
                //     }
                // }

                if (response['hydra:member'].length === 0) {
                    this.participated = 'no';
                }

                if((this.booking.timetableBlockPrice.registrationAvailableFor === "all_subscribers" || this.booking.timetableBlockPrice.registrationAvailableFor === "subscribers") && (this.realClient !== undefined || this.realClient['hydra:member'].length === 0)) {
                    this.participated = 'no-access';
                }

                if (this.booking.maxParticipantsCountLimit === this.booking.participantsCount) {
                    this.participated = 'completed';
                }

                let count = 0;
                if (this.booking.timetableBlockPrice.minActivityLevel) {
                    this.client['hydra:member'].forEach(element => {
                        if (element.activity && element.activity['@id'] === this.booking.activity['@id']) {
                            if (
                                element.activityLevels[0].identifier <= this.booking.timetableBlockPrice.maxActivityLevel.identifier &&
                                element.activityLevels[0].identifier >= this.booking.timetableBlockPrice.minActivityLevel.identifier
                            ) {
                                count++;
                            }
                        }
                    });
                    if (count === 0) {
                        this.participated = 'no-required';
                    }
                }

                if (this.booking.timetableBlockPrice.registrationAvailableFor === "everyone") {
                    this.participated = 'no';
                }
                if (this.realClient !== undefined) {
                    if (this.realClient['hydra:member'].length > 0) {
                        if (this.booking.timetableBlockPrice.registrationAvailableFor === "all_subscribers" && !this.realClient['hydra:member'][0].subscriptionCardsAvailable) {
                            this.participated = 'no-access';
                        }
                        if (
                            this.booking.timetableBlockPrice.registrationAvailableFor === "subscribers" &&
                            !this.realClient['hydra:member'][0].subscriptionCardsAvailable
                        ) {
                            this.participated = 'no-access';
                        }

                        if (this.realClient['hydra:member'][0].subscriptionCardsAvailable) {
                            if (this.booking.timetableBlockPrice.registrationAvailableFor === "all_subscribers" && this.realClient['hydra:member'][0].subscriptionCardsAvailable.length === 0) {
                                this.participated = 'no-access';
                            }
                            if (this.booking.timetableBlockPrice.registrationAvailableFor === "all_subscribers" && this.realClient['hydra:member'][0].subscriptionCardsAvailable.length > 0) {
                                this.participated = 'no';
                            }
                            if (this.booking.timetableBlockPrice.registrationAvailableFor === "subscribers" && this.realClient['hydra:member'][0].subscriptionCardsAvailable.length > 0) {
                                count = 0;
                                this.realClient['hydra:member'][0].subscriptionCardsAvailable.forEach(element => {
                                    this.booking.timetableBlockPrice.allowedSubscriptionPlans.forEach(element2 => {
                                        if (element2['@id'] === element.subscriptionPlan['@id']
                                            && moment(this.booking.startAt) < moment(element.endDate)) {
                                            count++;
                                        }
                                    });
                                });
                                if (count === 0) {
                                    this.participated = 'no-access';
                                } else {
                                    this.participated = 'no';
                                }
                            }
                        }
                    }
                }

                if (this.participated === 'no-access') {
                    this.isReady = true;
                    return;
                }

                if (
                    this.booking.registrationTimeBeforeStart &&
                    this.booking.registrationTimeBeforeStart !== 0 &&
                    (Number(Date.now()) < (Number(new Date(this.booking.startAt)) -
                        this.booking.registrationTimeBeforeStart * 1000))
                ) {
                    this.participated = 'waiting';
                }

                if (this.booking.maxParticipantsCountLimit <= this.booking.participantsCount) {
                    if (this.booking.participantsQueueEnabled === true) {
                        this.participated = 'waiting-list';
                    } else {
                        this.participated = 'completed';
                    }
                }

                if (response['hydra:member'].length  > 0) {
                    if (this.booking.participantsCount > 0 && response['hydra:member'][0].confirmed === true){
                        if (response['hydra:member'][0].inQueue === true) {
                            this.participated = 'in-queue';
                        } else {
                            this.participated = 'paid';
                        }
                    }
                    else {
                        this._cancelBooking(response);
                    }
                }

                if (new Date(this.booking.startAt) < new Date()) {
                    this.participated = '';
                }

                if (this.booking.canceled) {
                    this.participated = '';
                }

                this.isReady = true;
            }
        );
    }


    getDiff() {
        const diffMinutes = moment(this.booking.endAt).diff(moment(this.booking.startAt), 'minutes');
        if (diffMinutes < 60) {
            return diffMinutes + 'min';
        } else if ((parseInt('' + (diffMinutes / 60), null) * 60) === diffMinutes) {
            return (diffMinutes / 60) + 'h';
        } else {
            return parseInt('' + (diffMinutes / 60), null) + 'h' + (diffMinutes - (parseInt('' + (diffMinutes / 60), null) * 60));
        }
    }

    getDiffInMin() {
        return moment(this.booking.endAt).diff(moment(this.booking.startAt), 'minutes') + ' min';
    }

    async _cancelBooking(bookingParticipants) {
        this.isReady = false;
        if ((bookingParticipants['hydra:member'] as Array<any>).length === 0) {
            this.isReady = true;
            return;
        }

        const userHere = bookingParticipants['hydra:member'][0];
        if (userHere === undefined) {
            this.isReady = true;
            return;
        } else {
            await this.bookingService.updateParticipantCourse(
                {canceled: true, accompanyingParticipants: []}, userHere['@id']).subscribe(
                async () => {
                    this.iconParticipants = await this.bookingService.getIconPraticipants(this.booking['@id']).toPromise();
                    this.booking = await this.bookingService.get(this.booking['@id']).toPromise();
                    this.checkPriority();
                }
            );
        }
    }

    async cancelBooking() {
        this.isReady = false;
        await this.bookingService.getBookingParticipants(this.booking['@id'], this.userMe.id).subscribe(
            async (bookingParticipants) => {
                
                await this._cancelBooking(bookingParticipants);

            });
    }

    openModal() {
        let cssClass = "course-details-class";
        if (!(1 < this.booking.timetableBlockPrice.maxAccompanyingParticipantsCountLimit && 1 < (this.booking.maxParticipantsCountLimit - this.booking.participantsCount)))
        {
            this.loaderService.presentLoading();
            cssClass = "course-details-class opacity-0";
        }
        this.modalService.courseCurseBookingModal(CourseBookingComponent, this.booking, this.userMe, this.participated, this.description, cssClass).then(mod => {
            mod.onDidDismiss().then( async data => {
                this.isReady = false;
                await this.bookingService.get(this.booking['@id']).subscribe(
                    async (response) => {
                        this.iconParticipants = await this.bookingService.getIconPraticipants(this.booking['@id']).toPromise();
                        this.booking = response;
                        if (data.data === undefined || data.data === false) {
                            this.booking = await this.bookingService.get(this.booking['@id']).toPromise();
                            this.cancelBooking();
                        }
                        if (data.data) {
                            this.checkPriority();

                        }
                    }
                );
            });
        });
    }

    goToComments() {
        this.modalService.presentCourseComments(ClassCommentsModalComponent, this.booking.id, this.booking.name, this.userMe.id,
              this.booking.club,
              this.booking.club.logo.contentUrl)
    }

    dismiss(reload) {
        this.modalCtrl.dismiss(reload);
    }
}
