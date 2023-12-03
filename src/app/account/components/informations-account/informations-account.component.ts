import { Component, EventEmitter, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AlertController, ModalController} from '@ionic/angular';
import { InformationsComponent } from '../../informations/informations.component';
import { MyPreferencesComponent } from '../../my-preferences/my-preferences.component';
import { MyFriendsComponent } from '../../my-friends/my-friends.component';
import { MyClubsComponent } from '../../my-clubs/my-clubs.component';
import { MyActivitiesComponent } from '../../my-activities/my-activities.component';
import { MySubscriptionsComponent } from '../../my-subscriptions/my-subscriptions.component';
import { MyBookingsComponent } from '../../my-bookings/my-bookings.component';
import { MyCreditsComponent } from '../../my-credits/my-credits.component';
import { MyEventsComponent } from '../../my-events/my-events.component';
import { MyMatchesComponent } from '../../my-matches/my-matches.component';
import { MyOperationsComponent } from '../../my-operations/my-operations.component';
import { MyPaymentTypeComponent } from '../../my-payment-type/my-payment-type.component';
import { ParamsComponent } from '../../params/params.component';
import {PhoneNumberComponent} from '../../phone-number/phone-number.component';
import {PasswordComponent} from '../../password/password.component';
import {CguComponent} from '../../cgu/cgu.component';
import { MyConsumptionComponent } from '../../my-consumption/my-consumption.component';
import { MyCoursesComponent } from '../../my-courses/my-courses.component';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import {EnvironmentService} from "../../../shared/services/environment/environment.service";
import {DetailsComponent} from "../../my-wallets/details/details.component";
import {TranslateService} from "@ngx-translate/core";
import {PasswordModalComponent} from "./password-modal/password-modal.component";
import { takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-informations-account',
    templateUrl: './informations-account.component.html',
    styleUrls: ['./informations-account.component.scss']
})
export class InformationsAccountComponent implements OnInit, OnDestroy {
    @Input() userId: string;
    @Output() logout = new EventEmitter();
    @Output() refreshData = new EventEmitter();

    private dataUrl = 'assets/account-link.json';
    env: any;
    links$: Observable<any>;
    clubId: any;
    isLoaded = false;
    private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private http: HttpClient,
        private modalCtrl: ModalController,
        private clubIdStorageService: ClubIdStorageService,
        private environmentService: EnvironmentService,
        private alertController: AlertController,
        private translate: TranslateService
    ) {
        this.env = this.environmentService.getEnvFile();
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    async ngOnInit() {
        this.clubId = await this.clubIdStorageService.getClubId().then(clubId =>  clubId);
        // this.clubService.getClub(this.clubId).pipe(
        //   takeUntil(this.ngUnsubscribe),
        // ).subscribe(
        //   (club) => {
        //     this.http.get<any>(this.dataUrl).subscribe(data => {
        //       this.links = data;
        //       this.isLoaded = true;
        //     });
        //   }
        // );

        this.links$ = this.http.get<any>(this.dataUrl).pipe(
            takeUntil(this.ngUnsubscribe),
            tap(() => this.isLoaded = true),
            tap(() => console.log("isloaded"))
        );
    }

    goTo(component) {
        let componentToOpen;
        switch (component) {
            case "InformationsComponent":
                componentToOpen = InformationsComponent;
                break;
            case "ActivitiesComponent":
                componentToOpen = MyActivitiesComponent;
                break;
            case "MyPreferencesComponent":
                componentToOpen = MyPreferencesComponent;
                break;
            case "MyFriendsComponent":
                componentToOpen = MyFriendsComponent;
                break;
            case "MyClubsComponent":
                componentToOpen = MyClubsComponent;
                break;
            case "MySubscriptionsComponent":
                componentToOpen = MySubscriptionsComponent;
                break;
            case "MyCreditsComponent":
                componentToOpen = MyCreditsComponent;
                break;
            case "MyConsumptionComponent":
                componentToOpen = MyConsumptionComponent;
                break;
            case "MyWalletsComponent":
                componentToOpen = DetailsComponent;
                this.modalCtrl.create({
                    component: componentToOpen,
                    cssClass: 'my-component-open-class'
                })
                    .then(modal => {
                        modal.present().then();
                    });
                break;
            case "MyOperationsComponent":
                componentToOpen = MyOperationsComponent;
                break;
            case "MyBookingsComponent":
                componentToOpen = MyBookingsComponent;
                break;
            case "MyMatchesComponent":
                componentToOpen = MyMatchesComponent;
                break;
            case "MyCoursesComponent":
                componentToOpen = MyCoursesComponent;
                break;
            case "MyEventsComponent":
                componentToOpen = MyEventsComponent;
                break;
            case "MyPaymentTypeComponent":
                componentToOpen = MyPaymentTypeComponent;
                break;
            case "ParamsComponent":
                componentToOpen = ParamsComponent;
                break;
            case "CGUComponent":
                componentToOpen = CguComponent;
                break;
            case "PasswordComponent":
                componentToOpen = PasswordComponent;
                break;
            case "PhoneNumberComponent":
                componentToOpen = PhoneNumberComponent;
                break;
        }

        if (component !== "MyWalletsComponent") {
            this.modalCtrl.create({
                component: componentToOpen,
                cssClass: 'my-component-open-class',
                componentProps: {
                    userId: this.userId
                }
            })
                .then(modal => {
                    modal.present().then();
                    modal.onDidDismiss().then( data => {
                        if (data.data !== undefined && data.data.refresh) {
                            this.refreshData.emit(true);
                        }
                    });
                });
        }
    }

    logoutAction() {
        this.logout.emit();
    }

    async deleteAccount() {
        const alert = await this.alertController.create({
            header: this.translate.instant('title_alert_booking'),
            message: this.translate.instant('message_alert_delete_account'),
            buttons: [
                {
                    text: this.translate.instant('yes'),
                    handler: () => {
                        this.modalCtrl.create({
                            component: PasswordModalComponent,
                            cssClass: 'password-modal',
                            componentProps: {
                            }
                        })
                            .then(modal => {
                                modal.present().then();
                                modal.onDidDismiss().then( data => {
                                    if (data.data !== undefined && data.data.refresh) {
                                        this.refreshData.emit(true);
                                    }
                                });
                            });
                    }
                }, {
                    text: this.translate.instant('no')
                }
            ]
        });
        await alert.present();
    }
}
