import { AfterViewInit, Component, Input, OnInit, OnDestroy } from '@angular/core';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../shared/services/storage/user.service';
import { AttenderBooking } from '../../../shared/models/attender-booking';
import { BookingService } from '../../../shared/services/booking/booking.service';
import { BookingAttenderPaymentComponent } from '../booking-attender-payment/booking-attender-payment.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { AddSelectedDate } from '../../../state/actions/selectedDate.actions';
import { getPrimaryColor } from 'src/utils/get-primary-color';
import { tap, retry, switchMap } from 'rxjs/operators';
import {Observable, of, Subscription} from 'rxjs';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { ClubService } from 'src/app/shared/services/club/club.service';
import { reloadMyMatches } from 'src/app/state/actions/myMatches.actions';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { PlaygroundService } from 'src/app/shared/services/playground/playground.service';
import { Club } from 'src/app/shared/models/club';
import {ClientClub} from "../../../shared/models/client-club";
import {Friend} from "../../../shared/models/friend";
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import * as ics from 'ics';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements AfterViewInit, OnInit, OnDestroy {

  @Input() bookingIri: string;

  booking: any;
  client: ClientClub;
  participant: AttenderBooking = null;
  restToPay: number;
  participants: Array<AttenderBooking|Friend>;
  user: User = null;
  now: any;
  avatarBgColor: any;
  userSubscription$: Subscription;
  priceDetailsList: Map<string, any>;
  priceTotalList: Map<string, any>;
  playground: any;
  env;
  detailPriceCategories: Observable<Array<any>> = null;
  detailPriceformula: Observable<Array<any>> = null;
  cancellationCondition: string;
  filePath = this.environmentService.getEnvFile().pathFiles;
  club: Club;
  isLoaded = false;
  toRemove = [];
  newAttenders = [];

  actionToAddAttenders: boolean = false;
  showModalAddFriendOrUser: boolean = false;
  boolAddPart: boolean = false;
  typeOfUserToAdd: string = "";
  isAllowedToEdit: boolean = true;

  constructor(
    private modalCtr: ModalController,
    private translate: TranslateService,
    private alertController: AlertController,
    private toastService: ToastService,
    private userService: UserService,
    private bookingService: BookingService,
    private router: Router,
    private store: Store<AppState>,
    private accountService: AccountService,
    private clubService: ClubService,
    private environmentService: EnvironmentService,
    private playgroundService: PlaygroundService,
    private calendar: Calendar,
    private platform: Platform,
  ) {
    this.env = this.environmentService.getEnvFile();
    this.restToPay = 0;
  }

  ngOnInit() {
    this.avatarBgColor = getPrimaryColor();
    this.bookingService.get(this.bookingIri)
      .pipe(
        switchMap(booking => {
          return this.bookingService.getBookingParticipantsFull(booking.id).pipe(switchMap(dataParticipants => {
            if (dataParticipants['hydra:member']) {
              booking.participants = dataParticipants['hydra:member'];
            }
            return of(booking);
          }));
        }),
        tap( booking => {
          if (booking !== undefined) {
            this.booking = booking;
            switch (booking.activityType) {
              case 'leisure':
                this.getLeisureDetailPrice();
                break;
              case 'formula':
                this.getFormulaDetailPrice();
                break;
            }
          } else {
            retry();
          }
        }),
        switchMap( _ => {
          return this.userService.get();
        }),
        tap( (user: any) => {
          if (user !== undefined) {
            this.user = user
;            if (this.booking.participants) {
              this.booking.participants.forEach(participant => {
                if (participant.user && participant.user['@id'] === user['@id']) {
                  this.participant = participant;
                  this.restToPay = participant.restToPay;
                }
              });
              this.setOwnerFirst();
            }
          }
        }),
        switchMap( user => {
          return this.accountService.getClientClub(user.id, this.booking.club.id);
        }),
        tap( (resp: any) => {
          if (resp["hydra:member"]) {
            resp["hydra:member"].forEach(item => {
              this.client = item;
              this.setPriceDetails();
            })
          }
        }),
        switchMap( _ => {
          return this.clubService.get(this.booking.club['@id']);
        }),
        tap( (club: any) => {
          if (club !== undefined) {
            this.club = club;
          }
        })
      )
      .subscribe(
        async () => {
          this.playground = await this.playgroundService.getPlayground(
              this.booking.playgrounds[0]['@id'].replace('/clubs/playgrounds/', '')
          ).toPromise();
          if (this.playground) {
            this.cancellationCondition = this.hhmmss(this.playground.bookingCancellationConditionCustomHours);
            const matchDate = moment(this.booking.startAt);
            const now = moment();

            const differenceInSeconds = matchDate.diff(now, "seconds");
            if (differenceInSeconds < this.playground.bookingParticipantUpdateDelayAllowed) {
              this.isAllowedToEdit = true;
            }
          }
          this.isLoaded = true;
        }
      );
  }

  setOwnerFirst() {
    this.participants = this.booking.participants;
    const ownerIndex = this.participants.findIndex(el => el.bookingOwner);
    if(ownerIndex > -1) {
      const element = this.participants.splice(ownerIndex, 1)[0];

      this.participants.splice(0, 0, element);
    }
  }

  getFormulaDetailPrice() {
    const dataInit = [];

    if (this.booking.participants) {
      this.booking.participants.forEach(participant => {
        let exit = false;
        dataInit.map(item => {
          if (item.price === participant.price) {
            exit = true;
            item.count += 1;
          }
        });

        if (!exit) {
          dataInit.push({
            label: '',
            price: participant.price,
            count: 1
          });
        }
      });
    }

    this.detailPriceformula = of(dataInit);
  }

  getLeisureDetailPrice() {
    const dataInit = [];

    this.booking.participants.forEach(participant => {
      let exit = false;
      dataInit.map(item => {
        if (item.price === participant.price && participant.category.id === item.catId) {
          exit = true;
          item.count += 1;
        }
      });

      if (!exit) {
        dataInit.push({
          catId: participant.category.id,
          label: participant.category.label,
          price: participant.price,
          count: 1
        });
      }
    });

    this.detailPriceCategories = of(dataInit);
  }

  isNotBoooker() {
    if (this.booking.userClient) {
      if (this.user['@id'] === this.booking.userClient['@id']) {
        return false;
      }
    }
    return true;
  }
  ngAfterViewInit() {
  }

  hhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${this.pad(hours) != '00' ? this.pad(hours) + 'h' : ''} ${this.pad(minutes) != '00' ? this.pad(minutes) + 'min' : ''} ${this.pad(secs) != '00' ? this.pad(secs) + 'sec' : ''}`;
  }

  pad(num) {
    return ("0" + num).slice(-2);
}

  async addToCalendar() {
    const address = (this.club.address ? this.club.address.join(", ") : '') + this.club.city + ", "  + this.club.zipCode;

    if (this.platform.is('ios') || this.platform.is('android')) {
      this.calendar.createEventInteractively(
          this.club.name + ' - ' + moment(this.booking.startAt).format('YYYY-MM-DD HH:mm'), // title
          address, // location
          undefined,
          new Date(moment(this.booking.startAt).tz(this.club.timezone).format()),
          new Date(moment(this.booking.endAt).tz(this.club.timezone).format() )
      );
    } else {
      const event = {
        start: [Number(moment(this.booking.startAt).tz(this.club.timezone).format('YYYY')), Number(moment(this.booking.startAt).tz(this.club.timezone).format('M')), Number(moment(this.booking.startAt).tz(this.club.timezone).format('D')), Number(moment(this.booking.startAt).tz(this.club.timezone).format('HH')), Number(moment(this.booking.startAt).tz(this.club.timezone).format('mm'))],
        end: [Number(moment(this.booking.endAt).tz(this.club.timezone).format('YYYY')), Number(moment(this.booking.endAt).tz(this.club.timezone).format('M')), Number(moment(this.booking.endAt).tz(this.club.timezone).format('D')), Number(moment(this.booking.endAt).tz(this.club.timezone).format('HH')), Number(moment(this.booking.endAt).tz(this.club.timezone).format('mm'))],
        title: this.club.name + ' - ' + moment(this.booking.startAt).format('YYYY-MM-DD HH:mm'),
        location: address,
      };

      await this.handleDownload(event);
    }
  }

  async handleDownload(event) {
    const filename = this.club.name + moment(this.booking.startAt).format('YYYY-MM-DD HH:mm') + '.ics';
    const file = await new Promise((resolve, reject) => {
      ics.createEvent(event, (error, value) => {
        if (error) {
          reject(error);
        }

        resolve(new File([value], filename, { type: 'text/calendar' }));
      });
    });
    // @ts-ignore
    const url = URL.createObjectURL(file);

    // trying to assign the file URL to a window could cause cross-site
    // issues so this is a workaround using HTML5
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  }

  close(refresh = false) {
    if(this.actionToAddAttenders) {
      this.actionToAddAttenders = false;
    } else {
      this.modalCtr.dismiss({ refresh }).then();
    }
  }

  isPassed() {
    const now = moment();
    if (moment(this.booking.startAt) > now) {
      return false;
    } else {
      return true;
    }
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

  async cancel() {
    const alert = await this.alertController.create({
      header: this.translate.instant('title_alert_booking'),
      message: this.translate.instant('message_alert_booking_canceled'),
      buttons: [
        {
          text: this.translate.instant('yes'),
          handler: () => {
            this.confirmCanceled();
          }
        }, {
          text: this.translate.instant('no')
        }
      ]
    });
    await alert.present();
  }

  async canceledAttender() {
    const alert = await this.alertController.create({
      header: this.translate.instant('title_alert_booking_participant_cancelation'),
      message: this.translate.instant('message_alert_participant_cancelation'),
      buttons: [
        {
          text: this.translate.instant('yes'),
          handler: () => {
            this.confirmCanceledAttender();
          }
        }, {
          text: this.translate.instant('no')
        }
      ]
    });
    await alert.present();
  }

  confirmCanceled() {
    this.bookingService.delete(this.booking).subscribe(() => {
      this.store.dispatch(reloadMyMatches({payload: true}));
      this.close(true);
    });
  }

  confirmCanceledAttender() {
    // TODO : Canceled Booking
    this.bookingService.deleteAttender(this.participant).subscribe(() => {
      this.close(true);
    });
  }

  createNewBooking() {
    let date = moment();
    const currentDay = moment().day();
    const bookingDay = moment(this.booking.startAt).day();
    if (bookingDay > currentDay) {
      date = moment().add(parseInt('' + (bookingDay > currentDay), null), 'days');
    } else {
      date = moment().add(parseInt('' + (7 - currentDay + bookingDay), null), 'days');
    }
    const datestring = date.format('YYYY-MM-DD') + ' ' + moment(this.booking.startAt).format('HH:mm');
    this.store.dispatch(new AddSelectedDate(datestring));
    this.router.navigate(['select-booking'], { queryParams: { name: this.booking.club.name, guid: this.booking.club.id } })
      .then(() => {
        this.close();
      });
  }

  openPayment() {
    this.modalCtr.create({
      component: BookingAttenderPaymentComponent,
      componentProps: {
        booking: this.booking,
        restToPay: this.restToPay,
        user: this.user,
        participant: this.participant,
        stripeAccountReference: this.club.stripeAccountReference
      }
    })
    .then(item => {
      item.onDidDismiss().then(data => {
        if (data.data.success && data.data.booking) {
          setTimeout( _ => {
            this.bookingService.get(this.booking['@id'])
              .pipe(
                switchMap(booking => {
                  if (this.booking.activityType === 'leisure') {
                    return this.bookingService.getBookingParticipants(this.booking.id, this.user.id).pipe(switchMap(dataParticipants => {
                      if (dataParticipants['hydra:member']) {
                        booking.participants = dataParticipants['hydra:member'];
                      }
                      return of(booking);
                    }));
                  } else {
                    return of(booking);
                  }
                }),
                tap( booking => {
                  if (booking !== undefined) {
                    this.booking = booking;
                    if (this.booking.participants) {
                      this.booking.participants.forEach(participant => {
                        if (participant.user && participant.user['@id'] === this.user['@id']) {
                          this.participant = participant;
                          this.restToPay = participant.restToPay;
                        }
                      });
                    }
                    this.setPriceDetails();
                  } else {
                    retry(2);
                  }
                })
              )
              .subscribe();
          }, 1000);
        }
      });
      item.present().then();
    });
  }

  setPriceDetails() {
    this.priceDetailsList = new Map();
    let discountParticipantsCount = 0;
    // let restToPay = 0;
    this.priceDetailsList.set('normal', { count: 0, label: "", price: 0 });
    if (this.booking.participants) {
      this.booking.participants
          .filter(participant => participant.canceled === false)
          .map(participant => {
            if (participant.subscriptionCard) {
              discountParticipantsCount++;
              if (this.priceDetailsList.get(participant.subscriptionCard['plan']['id'])) {
                this.priceDetailsList.set(participant.subscriptionCard['plan']['id'],
                    {
                      count: this.priceDetailsList.get(participant.subscriptionCard['plan']['id']).count + 1,
                      label: '(' + participant.subscriptionCard['name'] + ')',
                      price: (participant.price * (this.priceDetailsList.get(participant.subscriptionCard['plan']['id']).count + 1))
                    });
              } else {
                this.priceDetailsList.set(participant.subscriptionCard['plan']['id'],
                    { count: 1, label: '(' + participant.subscriptionCard['name'] + ')', price: participant.price });
              }
            }
            // else {
            //   restToPay = participant.restToPay;
            // }
          });
    }

    this.priceDetailsList.set('normal',
      {
        count: this.booking.maxParticipantsCountLimit - discountParticipantsCount,
        label: "", price: this.booking.pricePerParticipant * (this.booking.maxParticipantsCountLimit - discountParticipantsCount)
      });

      /* restToPay * (this.booking.maxParticipantsCountLimit - discountParticipantsCount) */  }

  setPrice() {
    this.priceTotalList = new Map();
    // pas le prix du restToPay mais le prix du user.
    if (this.booking.paymentMethod === 'per_participant') {
      const myRestToPay = this.booking.participants.filter(participant => participant.client.id === this.client.id)[0]['price'];
      this.priceTotalList.set('normal', { count: 1, label: 'Participant', price: myRestToPay });
    }
    this.booking.payments.map(paiment => {
      if (paiment.metadata && paiment.metadata.paymentTokenValue) {
        this.priceTotalList.set(paiment.userClient['@id'],
          {
            count: paiment.metadata.paymentTokenValue,
            label: paiment.name,
            price: '-' + paiment.amount
          });
      } else if (paiment.provider === "wallet") {
        this.priceTotalList.set(paiment.userClient['@id'] + 'wallet',
          {
            count: 1,
            label: 'Wallet',
            price: '-' + paiment.amount
          });
      }
    });
  }

  changeAttenders(attenders: Array<AttenderBooking>) {
    this.newAttenders = [];
    for(const attender of attenders) {
      const findToRemove = attender.user && !attender['@type'] ? this.toRemove.findIndex((x) => x.client && x.client.id === attender.user.id) : this.toRemove.findIndex((x) => x.client && x.client.id === attender.client.id);
      const findUser = attender.user && !attender['@type'] ? this.booking.participants.find((x) => x.client.id === attender.user.id) : this.booking.participants.find((x) => x.client.id === attender.client.id);
      if(!findUser) {
        this.newAttenders.push(attender);
      }
      if(findToRemove >= 0) {
        this.toRemove.splice(findToRemove, 1);
      }
    }
  }

  setParticipantsToRemove(attend: AttenderBooking|Friend) {
    this.toRemove.push(attend);
  }

  async saveParticipants() {
    const promises = [];
    for(const [index, value] of this.toRemove.entries()) {
      promises.push(await this.removeParticipant(value, index));
    }
    for(const attender of this.newAttenders) {
      const data = { booking: `/clubs/bookings/${this.booking.id}` };
      if(attender.user['@id'].includes('/user-clients/')) {
        data['user'] = attender.user['@id'];

      } else {
        data['client'] = attender.user['@id'];
      }
      promises.push(
          new Promise(async (resolve, reject) => {
            await this.bookingService.addBookingParticipant(data).toPromise().then((data) => {
              if(data) {
                this.booking.participants.push(data);
                this.participants = this.booking.participants;
                resolve(null);
              } else {
                this.participants = this.booking.participants;
                reject(null);
              }
            })
          })
      );
    }

    Promise.all(promises).finally(() => {
      this.actionToAddAttenders = false;
      this.toastService.presentSuccess("participants_edited", 'top')
    })
  }

  async removeParticipant(attender: AttenderBooking|Friend, index: number) {
    const participantIndex = attender.user && !attender['@type'] ? this.booking.participants.findIndex((x) => x.client.id === attender.user.id) : this.booking.participants.findIndex((x) => x.client.id === attender.client.id);
    if(participantIndex >= 0) {
      return new Promise((resolve, reject) => {
        this.bookingService.removeBookingParticipant(this.booking.participants[participantIndex]).toPromise().then((value) => {
          if(value) {
            resolve(null)
            this.booking.participants.splice(participantIndex, 1);
            this.toRemove.splice(index, 1);
            this.participants = this.booking.participants;
          } else {
            this.participants = this.booking.participants;
            this.toRemove.splice(index, 1);
            this.actionToAddAttenders = false;
            setTimeout(() => {
              this.actionToAddAttenders = true;
            }, 1)
            reject(null)
          }
        })
      })
    } else {
      const newAttenderIndex = this.newAttenders.findIndex((x) => x.user.id === attender.user.id);
      if(newAttenderIndex >= 0) {
        return this.newAttenders.splice(newAttenderIndex, 1);
      }

      return true;
    }
  }

  openModalAddFriendOrUser() {
    this.showModalAddFriendOrUser = true;
  }

  closeModalAddFriendOrUser() {
    this.showModalAddFriendOrUser = false;
  }

  resetAddBool() {
    this.boolAddPart = false;
    this.typeOfUserToAdd = "";
  }

  addParticipant(typeOfUser) {
    this.boolAddPart = true;
    this.typeOfUserToAdd = typeOfUser;
    console.log(typeOfUser, "<=== typeOfUser");
    this.showModalAddFriendOrUser = false;
  }

  isClientOwner() {
    let index = this.booking.participants.findIndex(el => el.bookingOwner && this.user.id === el.user?.id);
    return index !== -1;
  }

  getDiffInMin() {
    return moment(this.booking.endAt).diff(moment(this.booking.startAt), 'minutes') + ' minutes';
  }

  ngOnDestroy(): void {
    if (this.userSubscription$ !== undefined) {
      this.userSubscription$.unsubscribe();
    }
  }
}
