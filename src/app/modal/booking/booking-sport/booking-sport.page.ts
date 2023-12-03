import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Booking } from '../../../shared/models/booking';
import { AttenderBooking } from '../../../shared/models/attender-booking';
import { Playground } from '../../../shared/models/playground';
import { UserService } from '../../../shared/services/storage/user.service';
import { SlotBlock } from '../../../shared/models/slot-block';
import * as moment from 'moment';
import { User } from '../../../shared/models/user';
import { PriceCalculatorService } from '../../../shared/services/price/price-calculator.service';
import { Price } from '../../../shared/models/price';
import { Club } from '../../../shared/models/club';
import { AccountService } from '../../../shared/services/account/account.service';
import { Wallet } from '../../../shared/models/wallet';
import { ClientClub } from '../../../shared/models/client-club';
import {Observable, Subscription} from 'rxjs';
import { catchError, switchMap, tap, take } from 'rxjs/operators';
import { BookingSportConfirmPage } from '../booking-sport-confirm/booking-sport-confirm.page';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { Store, select } from '@ngrx/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { getCurrentClub } from 'src/app/club/store';
import { PlaygroundService } from 'src/app/shared/services/playground/playground.service';
import { PlaygroundOption, PlaygroundOptionDTO } from 'src/app/shared/models/playgroung-option';
import { ClubIdStorageService } from 'src/app/shared/services/clud-id-storage/club-id-storage.service';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-booking-sport',
  templateUrl: './booking-sport.page.html',
  styleUrls: ['./booking-sport.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingSportPage implements OnInit, OnDestroy {
  @Input() slotData: SlotBlock;
  @Input() playground: Playground;
  @Input() duration: any;
  @Input() activity: any;
  @Input() prices: any;

  booking: Booking;
  attenders: Array<AttenderBooking> = [];
  countPlayer: number = null;
  choicesCountPlayer: Array<number>;
  choicesCountPlayerWithPrice: Array<any> = [];
  name: string;
  timeTableBlockPricesId: string;
  activityIri: string;
  defaultPrice: number;
  user: User;
  priceUsed: Price = null;
  club: Club;
  wallet: Wallet;
  client: ClientClub;
  // TODO: redefine types
  club$: Observable<any>;
  userSub: Subscription;
  optionsSub: Subscription;
  allSubscriptions$ = new Subscription();
  currentClubSub = new Subscription();
  allDataLoaded = false;
  options: Array<PlaygroundOption>;
  playgroundOptions: Array<PlaygroundOptionDTO> = [];
  showOptions = false;
  boolAddPart: boolean = false;
  typeOfUserToAdd = "";
  startAt: any;

  showModalAddFriendOrUser: boolean = false;

  priceVariationsList: Array<any> = [];
  pricesVariationsListSub: Subscription;

  constructor(
      private toastService: ToastService,
      private ctrl: ModalController,
      private userService: UserService,
      private priceCalculatorService: PriceCalculatorService,
      private accountService: AccountService,
      private playgroundService: PlaygroundService,
      private cd: ChangeDetectorRef,
      private environmentService: EnvironmentService,
      private clubStore: Store<ClubState>,
      private clubIdStorageService: ClubIdStorageService  ) {
    this.countPlayer = null;
    this.choicesCountPlayer = [];
    this.attenders = [];
  }

  ngOnInit() {
    this.allDataLoaded = false;
    this.initializeBooking();
    this.countPlayer = this.getDefaultCountPlayer();

    // let counter = 0;

    this.currentClubSub = this.clubStore.pipe(
        select(getCurrentClub),
        tap((club: any) => this.club = club)
    ).subscribe();
    const defaultPrice = this.getDefaultPrice(this.slotData.prices);
    const iri = `/clubs/playgrounds/timetables/blocks/prices/${defaultPrice.id}/options.json?itemsPerPage=500`;
    this.optionsSub = this.playgroundService.getOptions(iri).pipe(
        tap(result => {
          this.options = result;
          this.options.map((x) => {
            x.option = `/clubs/playgrounds/options/${x.id}`;
          });
          this.showOptions = result.length !== 0;
          this.cd.markForCheck();
        })
    ).subscribe();
    this.userSub = this.userService.get()
        .pipe(
            take(1),
            tap((user: any) => {
              // counter += 1;
              if (user) {
                this.user = user;
                this.name = user.lastName + ' ' + user.firstName;
              } else {
                // TODO: IS it possible for the user to arrive to this page if there's no user ?
              }
              const setCount = [];
              const blockPricesCount = [];
              this.slotData.prices.map(price => {

                if (price.bookable && price.duration === this.duration) {
                  // if (price.duration === this.duration && price.participantCount === this.countPlayer) {

                  // }
                  blockPricesCount[price.participantCount] = {
                    blockPrice: price['id'],
                    activity: this.activity.id
                  };

                  if (!setCount.includes(price.participantCount)) {
                    setCount.push(price.participantCount);
                    this.choicesCountPlayer.unshift(price.participantCount);
                    this.choicesCountPlayerWithPrice.unshift({
                      count: price.participantCount,
                      price: this.getPriceByCountPlayer(price.participantCount)
                    });
                  }

                  this.pricesVariationsListSub = this.priceCalculatorService.getPriceVariations(price.id).subscribe(
                      data => {
                        this.priceVariationsList = this.priceVariationsList.concat(data);
                      },
                      error => { console.log(error); }
                  );
                }
              });
              const defaultPrice = this.getDefaultPrice(this.slotData.prices);
              this.priceUsed = defaultPrice;
              this.countPlayer = defaultPrice.participantCount;
              this.defaultPrice = defaultPrice.pricePerParticipant;
              this.timeTableBlockPricesId = defaultPrice.id;
              this.activityIri = this.activity.id;
              if (this.countPlayer === null && this.choicesCountPlayer.length > 0) {
                this.countPlayer = this.choicesCountPlayer[0];
              }
            }),
            switchMap(user => {
              // counter += 1;
              return this.accountService.getClientClub(user.id, this.club.id);
            }),
            tap(clientData => {
              let client = null;
              if (clientData['hydra:member'].length > 0) {
                client = clientData['hydra:member'][0];
                this.wallet = client.wallet;
                this.client = client;
              }

              this.startAt = this.slotData.selectTime.clone();
              this.startAt.tz(this.club.timezone, true);
              this.startAt.hour(this.slotData.startAt.split(':')[0]).minute(this.slotData.startAt.split(':')[1]);
              this.startAt.second(0);

              const priceData = this.priceCalculatorService.getClientPrice(
                  this.priceUsed, this.priceVariationsList, this.client, this.club, this.startAt
              );

              this.attenders.push({
                restToPay: priceData.price,
                subscriptionCard: this.getSubscriptionCard(client, priceData),
                user: this.user
              });

              this.allDataLoaded = true;
              this.cd.markForCheck();
            }),

            catchError(error => {
              this.allDataLoaded = false;
              throw (error);
            })
        )
        .subscribe();
  }

  getDefaultCountPlayer() {
    const defaultPrices = this.slotData.prices;
    const newPrices = [];
    defaultPrices.forEach((item: any) => {
      if (item.duration === this.duration) {
        newPrices.push(item);
      }
    });
    const defaultPrice = newPrices.reduce(
        (minPrice, currentPrice) => {
          return (currentPrice.participantCount < minPrice.participantCount) ? currentPrice : minPrice;
        }, newPrices[0]
    );

    if (defaultPrice) {
      return defaultPrice.participantCount;
    }
    return null;
  }

  getSubscriptionCard(client, priceData) {
    const startAt = this.slotData.selectTime.clone();
    startAt.tz(this.club.timezone, true);
    startAt.hour(this.slotData.startAt.split(':')[0]).minute(this.slotData.startAt.split(':')[1]);
    startAt.second(0);

    return (client && client.subscriptionCardsAvailable) ?
        client.subscriptionCardsAvailable.find(subscriptionCard => {
          return (priceData && priceData.subscriptionCard === subscriptionCard['@id'] &&
              moment.utc(subscriptionCard.endDate).unix() > startAt.unix() &&
              moment.utc(subscriptionCard.startDate).unix() < startAt.unix()
          );
        }) : undefined;
  }

  initializeBooking() {
    this.booking = {
      timetableBlockPrice: null,
      activity: null,
      canceled: null,
      club: null,
      comments: null,
      startAt: null,
      payments: null,
      endAt: null,
      name: null,
      playgroundOptions: [],
      playgrounds: null,
      maxParticipantsCountLimit: null,
      userClient: null,
      participants: [],
      pricePerParticipant: null,
      paymentMethod: null,
      creationOrigin: this.environmentService.getEnvFile().bookingOrigin,
      confirmed: false
    };
  }

  changeAttenders(attenders: Array<AttenderBooking>) {
    // this.attenders = attenders;
    this.allDataLoaded = false;
    attenders.map(attender => {
      let priceData = null;
      if (attender.user.id !== this.user.id) {
        priceData = this.priceCalculatorService.getClientPrice(
            this.priceUsed,
            this.priceVariationsList,
            attender.user,
            this.club,
            this.startAt
        );

        attender.restToPay = priceData.price;
        attender.subscriptionCard = this.getSubscriptionCard(attender.user, priceData);

        return attender;
      } else {
        priceData = this.priceCalculatorService.getClientPrice(
            this.priceUsed,
            this.priceVariationsList,
            this.client,
            this.club,
            this.startAt
        );
        attender.restToPay = priceData.price;
        attender.subscriptionCard = this.getSubscriptionCard(attender.user, priceData);
        return attender;
      }
    });

    this.attenders = attenders;
    this.allDataLoaded = true;
  }

  async goToConfirmBooking() {
    const startAt = this.slotData.selectTime.clone();
    startAt.tz(this.club.timezone, true);
    startAt.hour(this.slotData.startAt.split(':')[0]).minute(this.slotData.startAt.split(':')[1]);
    const endAt = startAt.clone();
    startAt.second(0);
    endAt.second(0);
    endAt.add(this.duration, 'seconds');
    endAt.tz(this.club.timezone, true);

    const participants: Array<AttenderBooking> = [];
    this.name = '';
    this.attenders.forEach(item => {
      this.name = this.attenders.map((x: AttenderBooking) => x.user.lastName).join(' / ');
      if (item.user['@type'] === 'UserClient') {
        participants.push({
          user: item.user['@id'],
          subscriptionCard: item.subscriptionCard,
          restToPay: item.restToPay
        });
      } else if (item.user['@type'] === 'ClubClient') {
        participants.push({
          client: item.user['@id'],
          subscriptionCard: item.subscriptionCard,
          restToPay: item.restToPay
        });
      }
    });

    if (participants.length < this.countPlayer && this.environmentService.isLockedFullParticipant()) {
      this.toastService.presentError('error_count_participant_booking', 'top');
      return;
    }


    const clubId =  await this.clubIdStorageService.getClubId().then(data =>  data);
    this.booking = {
      timetableBlockPrice: "/clubs/playgrounds/timetables/blocks/prices/" + this.timeTableBlockPricesId,
      activity: '/activities/' + this.activityIri,
      canceled: false,
      club: '/clubs/' + clubId,
      comments: undefined,
      startAt: startAt.utc().format('YYYY-MM-DD HH:mm:ss'),
      payments: [],
      endAt: endAt.utc().format('YYYY-MM-DD HH:mm:ss'),
      name: this.name,
      playgroundOptions: this.playgroundOptions,
      playgrounds: [this.playground],
      maxParticipantsCountLimit: this.countPlayer,
      userClient: this.user['@id'],
      participants,
      pricePerParticipant: this.defaultPrice,
      paymentMethod: '',
      creationOrigin: this.environmentService.getEnvFile().bookingOrigin,
    };
    this.ctrl.create({
      component: BookingSportConfirmPage,
      cssClass: 'sport-confirm-class',
      componentProps: {
        booking: this.booking,
        playground: this.playground,
        activityId: this.activityIri,
        methods: this.slotData.paymentMethods,
        slot: this.slotData,
        wallet: this.wallet,
        client: this.client,
        // prices: this.slotData.prices,
        price: "/clubs/playgrounds/timetables/blocks/prices/" + this.timeTableBlockPricesId,
        clubTimezone: this.club.timezone
      }
    })
    .then(item => {
      item.onDidDismiss().then(backData => {
        if (backData.data) {
          this.booking = backData.data.booking;
          this.booking.club = '/clubs/' + clubId;
          if (backData.data.success) {
            item.dismiss().then(_ => this.closeModal({ success: true, booking: this.booking }));
          }
        }
      });
      return item.present();
    });
}
  // END OF REFACTORING

  openModalAddFriendOrUser() {
    this.showModalAddFriendOrUser = true;
  }

  closeModalAddFriendOrUser() {
    this.showModalAddFriendOrUser = false;
  }

  closeModal(data) {
    this.ctrl.dismiss(data);
  }

  updateCountPlayer(val) {
    this.countPlayer = val;
    this.slotData.prices.forEach(price => {

      if (price.participantCount === this.countPlayer && this.duration === price.duration) {
        this.priceUsed = price;
        this.countPlayer = price.participantCount;
        this.defaultPrice = price.pricePerParticipant;
        this.timeTableBlockPricesId = price.id;
      }
    });
    this.attenders.map(item => {
      item.restToPay = this.priceUsed.pricePerParticipant;
      item.subscriptionCard = null;
      return item;
    });
    this.changeAttenders(this.attenders)

    this.cd.markForCheck();
  }

  getPriceByCountPlayer(val) {
    if (!this.countPlayer) {
      this.countPlayer = val;
    }
    let result = 0;
    const prices = this.slotData.prices;
    const newPrices = [];
    prices.forEach((item: any) => {
      if (item.participantCount === val && item.duration === this.duration) {
        newPrices.push(item);
      }
    });
    const inTheEnd = newPrices.reduce(
        (minPrice, currentPrice) => {
          return (currentPrice.pricePerParticipant < minPrice.pricePerParticipant) ? currentPrice : minPrice;
        }, newPrices[0]
    );
    result = inTheEnd.pricePerParticipant;
    return result;
  }

  getDefaultPrice(prices) {
    const newPrices = [];
    prices.forEach((item: any) => {
      if (item.participantCount === this.countPlayer && item.duration === this.duration) {
        newPrices.push(item);
      }
    });
    const inTheEnd = newPrices.reduce(
        (minPrice, currentPrice) => {
          return (currentPrice.pricePerParticipant < minPrice.pricePerParticipant) ? currentPrice : minPrice;
        }, newPrices[0]
    );

    return inTheEnd;
  }


  countOptionChanged(value) {
    this.playgroundOptions.forEach(option => {
      if (option.option === '/clubs/playgrounds/options/' + value.id) {
        option.quantity = parseInt(value['quantity'], 10);
      }
    });
  }
  optionChanged(value) {
    const optionIndexToChange = this.playgroundOptions.findIndex(option => option.option === value);
    const optionChanged = this.options.find(option => option.id === value);

    if (optionIndexToChange === -1) {
      const optionToAdd: PlaygroundOptionDTO = {
        quantity: (optionChanged.minQuantity) ? optionChanged.minQuantity : undefined,
        option: `/clubs/playgrounds/options/${optionChanged.id}`,
        price: optionChanged.price,
        label: optionChanged.label,
      };
      this.playgroundOptions.push(optionToAdd);
    } else {
      this.playgroundOptions.splice(optionIndexToChange, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.currentClubSub) {
      this.currentClubSub.unsubscribe();
    }
    if (this.pricesVariationsListSub) {
      this.pricesVariationsListSub.unsubscribe();
    }
    if (this.optionsSub) {
      this.optionsSub.unsubscribe();
    }
  }

  addParticipant(typeOfUser) {
    this.boolAddPart = true;
    this.typeOfUserToAdd = typeOfUser;
    this.showModalAddFriendOrUser = false;
  }

  resetAddBool() {
    this.boolAddPart = false;
    this.typeOfUserToAdd = "";
  }

}
