import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";
import {Store} from "@ngrx/store";
import {AppState} from "../state/app.state";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {ClubService} from "../shared/services/club/club.service";
import {EnvironmentService} from "../shared/services/environment/environment.service";
import {ModalController} from "@ionic/angular";
import {CalendarComponent} from "../modal/calendar/calendar.component";
import {BookingGroupPaymentComponent} from "../modal/booking-group-payment/booking-group-payment.component";
import {ActivityService} from "../shared/services/activity/activity.service";
import {PlaygroundService} from "../shared/services/playground/playground.service";
import {AccountService} from "../shared/services/account/account.service";
import {LoaderService} from "../shared/services/loader/loader.service";
import {ToastService} from "../shared/services/toast.service";
import {BookingSuccesModalComponent} from "../club-booking-list/components/booking-succes-modal/booking-succes-modal.component";
import {BookingDetailComponent} from "../modal/booking/booking-detail/booking-detail.component";
import {OptionsGroupSelectionComponent} from "../options-group-selection/options-group-selection.component";
import {BookingGroupFormComponent} from "../booking-group-form/booking-group-form.component";
import {SignComponent} from "../modal/auth/sign/sign.component";
import { Subject } from 'rxjs';
import {getCurrentMe} from "../account/store";

@Component({
  selector: 'app-booking-group-selection',
  templateUrl: './booking-group-selection.component.html',
  styleUrls: ['./booking-group-selection.component.scss']
})
export class BookingGroupSelectionComponent implements OnInit, OnDestroy {
  user: any = null;
  prestation: any;
  ready = false;
  club = null;
  clubId: any;
  categories: Array<any> = [];
  countParticipant = new Map();
  days: Array<any> = [];
  selectedDay = null;
  loadPlaygrounds: boolean = false;
  selectedSlot = null;
  choicePlayground: boolean = false;
  showDates = [];
  slots = [];
  slotsShowMore = [];
  showMore = false;
  skeleton = true;
  from: string;
  playgrounds: any;
  selectedPlayground: any;
  blockPrice: any;
  client; any;
  booking: any;
  customData: any;
  minParticipants: 0;
  maxParticipants: 0;
  formulaParticipant: 0;
  env: any;
  init: boolean;

  countActivities: number = 0;
  categoryId: string;
  activitySelectedId: any;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
      private modalController: ModalController,
      private route: ActivatedRoute,
      private router: Router,
      private clubService: ClubService,
      private environmentService: EnvironmentService,
      private store: Store<AppState>,
      private activityService: ActivityService,
      private playgroundService: PlaygroundService,
      private accountStore: Store<any>,
      private accountService: AccountService,
      private loaderService: LoaderService,
      private toastService: ToastService
  ) {
    this.init = false;
    this.env = this.environmentService.getEnvFile();
  }

  lessParticipant(idCat) {
    if (this.countParticipant.get(idCat) > 0) {
      this.countParticipant.set(idCat, this.countParticipant.get(idCat) - 1);
    }
  }

  showDate(date) {
    this.selectedDay = date;
    this.slots = [];
    this.showMore = false;
    this.skeleton = true;
    this.slots = [];
    this.slotsShowMore = [];
    this.loadSlots();
  }

  addParticipant(idCat) {
    this.countParticipant.set(idCat, this.countParticipant.get(idCat) + 1);
  }
  addFormulaParticipant() {
    if (this.formulaParticipant < this.maxParticipants) {
      this.formulaParticipant++;
    }
  }
  lessFormulaParticipant() {
    if (this.formulaParticipant > this.minParticipants) {
      this.formulaParticipant--;
    }
  }
  ngOnInit(): void {
    this.store.select("user").pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          if (user) {
            this.user = user;
          }
        })).subscribe();

    this.init = true;
    this.loadData();
  }

  loadData() {
    this.route.queryParams.pipe(
      takeUntil(this.ngUnsubscribe),
    ).subscribe(params => {
      this.prestation = JSON.parse(params["prestation"]);
      if (params['from']) {
        this.from = params["from"];
      }

      if (params["activitySelectedId"]) {
        this.activitySelectedId = params["activitySelectedId"];
      }
      if (params["countActivities"]) {
          this.countActivities = params["countActivities"];
      }
      if (params["categorySelectedId"]) {
          this.categoryId = params["categorySelectedId"];
      }

      this.clubId = params["clubId"];
      this.clubService.getClub(this.clubId).pipe(
        takeUntil(this.ngUnsubscribe),
      ).subscribe(club => {
        this.club = club;
        this.activityService.getBlockPrice(this.prestation.id).subscribe(blockPrice => {
          this.blockPrice = blockPrice;
          this.selectedDay = moment(moment().tz(this.club.timezone).format());
          this.showDates = [];
          this.showDates.push(this.selectedDay);
          const clone1 = this.selectedDay.clone();
          clone1.add(1, 'day');
          this.showDates.push(clone1);
          const clone2 = clone1.clone();
          clone2.add(1, 'day');
          this.showDates.push(clone2);
          const clone3 = clone2.clone();
          clone3.add(1, 'day');
          this.showDates.push(clone3);
          const clone4 = clone3.clone();
          clone4.add(1, 'day');
          this.showDates.push(clone4);
          const clone5 = clone4.clone();
          clone5.add(1, 'day');
          this.showDates.push(clone5);
          const clone6 = clone5.clone();
          clone6.add(1, 'day');
          this.showDates.push(clone6);

          if (blockPrice === undefined) {
            return;
          }

          this.categories = blockPrice.participantCategories;
          if (this.categories == null || (this.categories && this.categories.length === 0)) {
            if (blockPrice.activityType === 'formula') {
              // create participant
              this.minParticipants = blockPrice.minParticipantsCountLimit;
              this.maxParticipants = blockPrice.maxParticipantsCountLimit;
              this.formulaParticipant = this.minParticipants;
            }
          }
          if (this.categories) {
            this.categories.forEach(item => {
              this.countParticipant.set(item.category['@id'], this.from === 'leisure' && this.categories.length === 1 ? 1 : 0);
            });

          }

          const dDayString = moment().tz(this.club.timezone).format('YYYY-MM-DD');

          this.playgroundService.getPlaygroundByBlockId(blockPrice.id, [], dDayString, this.from === 'leisure')
              .pipe(
                takeUntil(this.ngUnsubscribe),
                tap(data => {
                  this.playgrounds = data;
                  if (this.playgrounds.length > 0) {
                    this.selectedPlayground = this.playgrounds[0];
                  } else {
                    this.skeleton = false;
                    this.ready = true;
                    return;
                  }
                  this.ready = true;
                  this.loadSlots();
              }))
              .subscribe();

        });
      });
    });
  }
  availableSlots() {
    const slots = [];
    const totals = this.totalParticipant();

    this.slots.forEach(slot => {
      if ((slot.maxParticipantsCountLimit - slot.participantsCount) >= totals && (slot.maxParticipantsCountLimit - slot.participantsCount) !== 0) {
        if (slot.maxBookingsCountLimit > slot.bookingsCount) {
          if (!this.isOlderSlot(slot.startAt)) {
            let check = false;
            slots.map(slotCheck => {
              if (slotCheck.time === slot.startAt) {
                check = true;
                slotCheck.playgrounds.push(slot.playgroundId);
              }
            });

            if (!check) {
              const timeMoment = moment(this.selectedDay.format('YYYY-MM-DD ') + slot.startAt);
              slots.push({...slot, order: timeMoment, time: slot.startAt, playgrounds: [slot.playgroundId], available: slot.maxParticipantsCountLimit - slot.participantsCount});
            }

          }
        }
      }
    });

    slots.sort(function compare(a, b) {
      return a.order - b.order;
    });

    return slots;
  }
  isOlderSlot(time) {
    const dDay = moment().tz(this.club.timezone);
    if (this.selectedDay.format('YYYYMMDD') === dDay.format('YYYYMMDD')) {
      const slotDayTime = moment(this.selectedDay.format('YYYY-MM-DD') + " " + time).tz(this.club.timezone, true);
      if (slotDayTime <= dDay) {
        return true;
      }
    }
    return false;
  }
  totalParticipant() {
    if (this.from === 'formula') {
      return this.formulaParticipant;
    } else {
      let totalParticipant = 0;
      this.categories.forEach(cat => {
        totalParticipant = totalParticipant + this.countParticipant.get(cat.category['@id']);
      });
      return totalParticipant;
    }
  }

  getSerializedSlots() {

  }

  loadSlots() {
    this.slots = [];

    this.playgrounds.forEach(async playground  => {
      await this.activityService.getSlots(
          playground.id,
          this.blockPrice.id,
          this.selectedDay.format('YYYY-MM-DD')
      ).pipe(
        takeUntil(this.ngUnsubscribe),
        tap(data => {
          if (data) {
            if (data.items) {
              data.items.forEach(item => {
                item.playgroundId = playground.id;
                this.slots.push(item);
              });
            }
          }
          this.skeleton = false;
        }))
        .subscribe();
    });


  }

  showMoreSlots() {
    this.showMore = true;
  }

  getRandomInt() {
    return Math.floor(Math.random() * 45);
  }

  showCalendar() {
    this.modalController.create({
      component: CalendarComponent,
      cssClass: 'calendar-modal-class',
      swipeToClose: true,
      backdropDismiss: true,
      mode: 'ios'
    })
    .then(modal => {
      modal.present().then();
      modal.onDidDismiss().then( data => {
        if (data.data) {
          this.skeleton = true;
          this.slots = [];
          this.slotsShowMore = [];
          this.showDates = [];
          this.selectedDay = data.data;
          this.showDates.push(this.selectedDay);
          const clone1 = this.selectedDay.clone();
          clone1.add(1, 'day');
          this.showDates.push(clone1);
          const clone2 = clone1.clone();
          clone2.add(1, 'day');
          this.showDates.push(clone2);
          const clone3 = clone2.clone();
          clone3.add(1, 'day');
          this.showDates.push(clone3);
          const clone4 = clone3.clone();
          clone4.add(1, 'day');
          this.showDates.push(clone4);
          const clone5 = clone4.clone();
          clone5.add(1, 'day');
          this.showDates.push(clone5);
          const clone6 = clone5.clone();
          clone6.add(1, 'day');
          this.showDates.push(clone6);
          this.loadSlots();
        }
      });
    });
  }

  checkDispo(date) {
    let checked = false;
    this.slots.forEach(item => {
      if (item.date.format('YYYYMMDD') === date.format('YYYYMMDD')) {
        checked = true;
      }
    });
    return checked;
  }

  changedPlayground(event) {
    this.selectedPlayground = event.target.value;
  }

  choiceSlot(slot, formIsChecked = false, optionIsChecked = false, data = {options: [], catToReplace: null}) {
    if (this.blockPrice !== undefined) {
      if (!formIsChecked && this.from === 'formula') {

        if (this.prestation.form) {
          this.modalController.create({
            component: BookingGroupFormComponent,
            id: 'modal-booking-form',
            componentProps: {
              formulaParticipant: this.formulaParticipant,
              prestation: this.prestation,
              club: this.club,
              date: this.selectedDay,
              categories: this.categories,
              countParticipant: this.countParticipant,
              slot: slot,
              blockPrice: this.blockPrice
            },
            swipeToClose: true,
            backdropDismiss: true,
            mode: 'ios'
          }).then(modal => {
            modal.present().then();
            this.loaderService.dismiss().then();
            modal.onDidDismiss().then( (data: any) => {
              if (data.data.success) {
                this.customData = data.data.customData;
                this.choiceSlot(slot, true);
              }
            });
          });
        } else {
          this.choiceSlot(slot, true);
        }
      } else if (!optionIsChecked) {

      this.playgroundService.getOptions(this.prestation['@id'] + '/options.json').pipe(
          takeUntil(this.ngUnsubscribe),
          tap(result => {
            if (result.length > 0 || this.selectedCategories().length > 1) {
              result.map((x) => {
                x.option = `/clubs/playgrounds/options/${x.id}`;
              });
              this.modalController.create({
                component: OptionsGroupSelectionComponent,
                id: 'modal-booking-payment',
                componentProps: {
                  from: this.from,
                  formulaParticipant: this.formulaParticipant,
                  options: result,
                  prestation: this.prestation,
                  club: this.club,
                  date: this.selectedDay,
                  categories: this.categories,
                  countParticipant: this.countParticipant,
                  slot,
                  blockPrice: this.blockPrice
                },
                swipeToClose: true,
                backdropDismiss: true,
                mode: 'ios'
              }).then(modal => {
                modal.present().then();
                this.loaderService.dismiss().then();
                modal.onDidDismiss().then( (data: any) => {
                  if (data.data.success) {
                    this.choiceSlot(slot, true, true, data.data);
                  }
                });
              });
            } else {
              if (this.categories.length === 1) {
                let data = {
                  options: [],
                  catToReplace: this.categories[0].category["@id"]
                }
                this.loaderService.dismiss().then();
                this.choiceSlot(slot, true, true, data);
              } else {
                this.loaderService.dismiss().then();
                this.choiceSlot(slot, true, true);
              }
            }
          })
      ).subscribe();

      } else {
        this.openModalPayment(slot, data.options, data.catToReplace);
      }
    }
  }

  getAvailablePlaygrounds() {
    const playgrounds = [];
    const first = true;

    this.playgrounds.reverse().forEach(playground => {
      if (this.selectedSlot.playgrounds.includes(playground.id)) {
        if (first && this.selectedPlayground === null) {
          this.selectedPlayground = playground;
        }
        playgrounds.push(playground);
      }
    });

    return playgrounds;
  }

  closeModalPlayground(event) {
    if (event.target.className.includes('bloc-modal-choice')) {
      this.choicePlayground = false
    }

  }
  confirmSelectedSlot() {
    this.choicePlayground = false;
    this.selectSlot(this.selectedSlot, this.selectedPlayground);
  }

  selectSlot(slot, _playground = null) {

    if (slot.playgrounds.length > 0) {
      this.playgrounds.forEach(play => {
        if (play.id === slot.playgrounds[0]) {
          this.selectedPlayground = play;
        }
      });
      this.choicePlayground = false;
      this.selectedSlot = slot;
    } else {
      return;
    }

    if (this.totalParticipant() >= 1 || this.from === 'formula') {
      if (!this.user) {
        this.modalController
            .create({
              component: SignComponent,
              cssClass: 'sign-class'
            })
            .then(mod => {
              this.loaderService.dismiss();
              mod.present();
              mod.onDidDismiss();
            });
        this.loaderService.dismiss();
      } else {
        this.loaderService.presentLoading();
        this.accountStore.select(getCurrentMe).pipe(
            takeUntil(this.ngUnsubscribe),
            switchMap(client => {
              this.client = client;
              return this.accountService.getWallets();
            }),
            tap(wallets => {
              if (wallets) {
                wallets['hydra:member'].map(wallet => {
                  if (wallet.club['@id'] === this.club['@id']) {
                    this.client.wallet = wallet;
                  }
                });
              }
              const participants = [];
              if (this.totalParticipant() > 0 || this.from === 'formula') {
                this.countParticipant.forEach((part, key) => {
                  for (let i = 0; i < part; i++) {
                    participants.push({category: key});
                  }
                });
                this.choiceSlot(slot);
              } else {
                this.loaderService.dismiss().then();
              }
            })
        ).subscribe();
      }

    } else {
      this.loaderService.dismiss().then();
      this.toastService.presentInfo('Sélectionner un nombre de participants');
    }
  }

  getCountByCat(ref) {
    let val = null;
    this.countParticipant.forEach((value, key) => {
      if (key === ref) {
        val = value;
      }
    });

    return val;
  }

  backAction() {
    this.router.navigate(['choices-prestations'], {
      queryParams: {
        countActivities: this.countActivities,
        clubId: this.clubId,
        activitySelectedId: this.activitySelectedId,
        categorySelectedId: this.categoryId,
        from: this.from
      }
    });
    // this.navCtrl.navigateBack('choices-prestations').then();
  }

  selectedCategories() {
    let participantsList = [];
    this.countParticipant.forEach((key, value) => {
      if (key > 0) {
        const cat = this.categories.find(c => c.category['@id'] === value);
        participantsList.push({ label: cat.category.label, category: cat.category['@id'] });
      }
    });
    return participantsList;
  }

  openModalPayment(slot, options, catToReplace?) {
    this.categories.map(item => {
      item.count = this.getCountByCat(item.category["@id"]);
      item.isOwner = false;
      if (catToReplace === item.category["@id"]) {
        item.isOwner = true;
      }
    });


    this.modalController.create({
      component: BookingGroupPaymentComponent,
      id: 'modal-booking-payment',
      componentProps: {
        formulaParticipant: this.formulaParticipant,
        options,
        booking: this.booking,
        customData: this.customData,
        playgroundOptions: options,
        prestation: this.prestation,
        club: this.club,
        date: this.selectedDay,
        categories: this.categories,
        countParticipant: this.countParticipant,
        slot,
        playground: this.selectedPlayground,
        blockPrice: this.blockPrice
      },
      swipeToClose: true,
      backdropDismiss: true,
      mode: 'ios'
    }).then(modal => {
      modal.present().then();
      modal.onDidDismiss().then( data => {
        if (data.data.success) {
          this.router.navigate(['home']).then(() => {
            this.modalController.create({
              component: BookingSuccesModalComponent,
              componentProps: {
                bookingIRI: data.data.booking['@id'],
                booking: data.data.booking,
                club: this.club,
                msgCourse: 'toast_payment_success'
              },
              animated: true
            }).then(modalSuccess => {
              modalSuccess.present().then();
              modalSuccess.onDidDismiss().then( data2 => {
                this.modalController.create({
                  component: BookingDetailComponent,
                  componentProps: {
                    bookingIri: data2.data.bookingIRI
                  },
                  animated: true
                }).then(detailModal => {
                  detailModal.present().then();
                });
              });
            });
          });
        } else if (!data.data.success && !data.data.status) {
          this.modalController.create({
            component: BookingSuccesModalComponent,
            componentProps: {
              bookingIRI: data.data.booking['@id'],
              booking: this.booking,
              club: this.club,
              msgCourse: 'an_error_has_occured'
            },
            animated: true
          }).then(modalSuccess => {
            modalSuccess.present().then();
            modalSuccess.onDidDismiss().then( () => {});
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
