import { Component, Input, OnDestroy, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { slideInSlideOut } from 'src/app/animations';
import { ModalService } from 'src/app/shared/services/modal.service';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/shared/services/user/auth.service';
import { Observable, Subscription } from 'rxjs';
import { SelectFriendsComponent, SelectFriendsConfig } from 'src/app/components/friends/select-friends/select-friends.component';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentCard } from 'src/app/shared/models/payment-card';
import { StripeService } from 'src/app/shared/services/payment/stripe.service';
import { Cart } from 'src/app/shared/models/cart';
import { ManagePaymentService } from 'src/app/shared/services/payment/manage-payment.service';
import { BookingService } from 'src/app/shared/services/booking/booking.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { BookingSuccesModalComponent } from '../booking-succes-modal/booking-succes-modal.component';
import {tap, map} from "rxjs/operators";
import { CoursePaiementComponent } from '../paiement/paiement.component';
import {getCurrentMe} from "../../../account/store";
import {select, Store} from "@ngrx/store";
import * as AccountActions from "../../../account/store/account.actions";
import {getCurrentClub} from "../../../club/store";
import {ClubState} from "../../../club/store/club.reducers";


@Component({
  selector: 'app-course-booking',
  templateUrl: './course-booking.component.html',
  styleUrls: ['./course-booking.component.scss'],
  animations: [
    slideInSlideOut
  ]
})
export class CourseBookingComponent implements OnInit, OnDestroy {

  @Input() booking;
  @Input() userMe;
  @Input() participated;
  @Input() description;

  showModalAddFriendOrUser = false;

  paymentCard: Array<PaymentCard>;
  realClient: any;
  attenders = [];
  imageUrl: string;
  baseUrl: string = this.environmentService.getEnvFile().domainAPI;
  countPlace = 1;
  avatarBgColor = 'lightGray';
  restToPay = 0;
  pathFile = this.environmentService.getEnvFile().pathFiles;
  priceTotalList: any;
  totalOption: any;
  club: any;
  paymentMetadata: any;
  defaultCard: any;
  client: any;
  guid: any;
  continueRest: any;

  price: any;
  wallet: any;
  loaded = false;
  selectedMethod: any;

  card$: Observable<any>;
  cart: Cart;
  withWallet = false;
  withCredit = false;
  paymentsProvider: Array<string>;
  selectedProvider: string;
  cartPayment: any;
  isReserved = false;

  clubCurrencySub: Subscription;
  clubCurrency: string;
  stripeAccountReference: string;
  isReady = false;
  isReady1 = false;
  firstReady = false;
  priceUsed: any;
  particpantAdded: any;
  myPrice = 0;

  public PAYMENT_METHOD_COMPLETE = 'complete';
  public PAYMENT_METHOD_PER_PARTICIPANT = 'per_participant';
  public PAYMENT_METHOD_DEPOSIT = 'deposit';
  public PAYMENT_METHOD_ON_THE_SPOT = 'on_the_spot';

  constructor(
      private modalCtrl: ModalController,
      private route: ActivatedRoute,
      private platform: Platform,
      private loaderService: LoaderService,
      private stripeService: StripeService,
      private accountStore: Store<any>,
      private modalService: ModalService,
      public sanitizer: DomSanitizer,
      private authService: AuthService,
      private toastService: ToastService,
      private environmentService: EnvironmentService,
      private accountService: AccountService,
      private managePaymentService: ManagePaymentService,
      private bookingService: BookingService,
      private clubStore: Store<ClubState>,
      @Inject(LOCALE_ID) public locale: string
  ) {
    this.stripeService.reloadStripeAccount();
    this.platform.backButton.subscribeWithPriority(100, async () => {
      this.dismiss();
    });

    this.paymentsProvider = environmentService.getEnvFile().paymentsProvider;

  }

  ngOnDestroy(): void {
  }

  async ngOnInit() {
    this.isReady1 = false;
    this.attenders = [];
    this.guid = this.route.snapshot.queryParams.guid;

    // if (1 < this.booking.timetableBlockPrice.maxAccompanyingParticipantsCountLimit && 1 < (this.booking.maxParticipantsCountLimit - this.booking.participantsCount))
    // {
    //   this.loaderService.presentLoading();
    // }

    this.accountStore.select(getCurrentMe).pipe(tap(async data => {
      this.userMe = data;
      this.realClient = await this.accountService.getClubsClient(this.userMe.id, [this.guid]).toPromise();
      this.clubStore.pipe(
          select(getCurrentClub),
          tap(async club => {
            this.club = club;
            if (this.booking.maxParticipantsCountLimit <= this.booking.participantsCount && this.booking.participantsQueueEnabled === true) {
              this.nextPaiement('true');
            } else {
              if (1 < this.booking.timetableBlockPrice.maxAccompanyingParticipantsCountLimit && 1 < (this.booking.maxParticipantsCountLimit - this.booking.participantsCount))
                this.nextPaiement('no');
              else
                this.nextPaiement('true');
            }
          })).subscribe();
    })).subscribe();
  }

  getSubscriptionCard(client, priceData) {
    return (client && client.subscriptionCardsAvailable) ?
        client.subscriptionCardsAvailable.find(subscriptionCard => {
          return (priceData && priceData.subscriptionCard === subscriptionCard['@id']);
        }) : undefined;
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss(reload);
  }

  async cancelBooking(next?, particpantAdded?) {
    if (next === 'true') {
      this.loaderService.presentLoading();
    }

    this.booking = await this.bookingService.get(this.booking['@id']).toPromise();
    if (!this.userMe) {
      this.userMe = await this.authService.getConnectedUser(this.guid).toPromise();
      await this.accountStore.dispatch(AccountActions.setMe({ data: this.userMe }));
    }

    if (next === 'true') {
      await this.bookingService.addParticipantCourse(particpantAdded).subscribe(
          async (part) => {
            this.booking.price = part.price;
            this.booking.restToPay = part.price;
            this.restToPay = part.price;

            this.continueRest = part.restToPay;

            this.loaderService.dismiss();
            const itemsCart = [];
            itemsCart.push({
              product: part['@id']
            });
            part.accompanyingParticipants.forEach(accompanyingParticipant =>  {
              itemsCart.push({
                product: accompanyingParticipant
              });
            });
            console.log(part);
            await this.managePaymentService.createCart({
              items: itemsCart
            }).pipe(tap(cart => {
              this.cart = cart;
              if (this.cart['restToPay'] === 0) {
                if (part.confirmed === false) {
                  this.loaderService.presentLoading();
                  this.bookingService.updateParticipantCourse({confirmed: true}, part['@id'])
                  .subscribe((data) => {
                          console.log(data);
                          this.loaderService.dismiss();
          
                          if (data.confirmed === true) {
                              this.success();
                            } else {
                              this.toastService.presentError('booking_payment_aborted', 'top');
                          }
                      }
                  );
                } else {
                  this.success();
                }
              } else {
                this.modalService.coursePaiementBookingModal(
                  CoursePaiementComponent, this.booking, this.userMe, this.participated, this.cart, this.attenders, part
                ).then(mod => {
                  mod.onDidDismiss().then( data => {
                    console.log(data)
                    if (data && data.data) {
                      this.success();

                      // mod.dismiss().then(_ => this.dismiss(data.data));
                    } else {
                      mod.dismiss().then(_ => this.dismiss());
                    }
                  });
                  mod.present();
                });
              }
            })).subscribe();
          },
          (error) => {
            console.log(error);
            this.modalCtrl.dismiss(true);
          }
      );
    }
  }

  private success() {
    this.modalCtrl.create({
      component: BookingSuccesModalComponent,
      componentProps: {
        bookingIRI: this.booking.id,
        booking: this.booking,
        club: this.club,
        msgCourse: 'course_validated'
      },
      animated: true
    })
      .then(modal => {
        modal.onDidDismiss()
          .then(() => {
            modal.dismiss().then(_ => this.dismiss(true));
          });
        modal.present();
      });
  }

  addPlace() {
    if (this.countPlace  < this.description.maxAccompanyingParticipantsCountLimit + 1) {
      this.countPlace++;
    }
  }

  async lessPlace() {
    if (this.attenders.length > 0) {
      if (this.countPlace >= 1) {
        if (this.countPlace - 1 - this.attenders.length === 0) {
          this.attenders.splice(this.attenders.length - 1, 1);
        }
      }
      this.countPlace--;
    } else {
      if (this.countPlace >= 1) {
        if (this.countPlace - 1 - this.attenders.length === 0) {
          this.attenders.splice(this.attenders.length - 1, 1);
        }
        this.countPlace--;
      }
    }

  }

  numberReturn(){
    return new Array(this.countPlace - 1 - this.attenders.length);
  }


  async removeAttender(id: number) {
    const newList = [];
    // let deletedAttenders: any;
    this.attenders.forEach((item, i) => {
      if (i !== id) {
        newList.push(item);
      }
      // else {
      //   deletedAttenders = item;
      // }
    });
    this.attenders = newList;
  }

  addParticipant(typeOfUser) {
    this.showModalAddFriendOrUser = false;
    this.modalCtrl.create({
      component: SelectFriendsComponent,
      cssClass: 'friends-select-class',
      componentProps: {
        isCreationMode: true,
        selectedFriends: this.attenders,
        maxAttenders: this.description.maxAccompanyingParticipantsCountLimit - 1,
        action: 'add',
        config: SelectFriendsConfig.BOOKING_CREATE,
        typeOfUser
      }
    }).then(mod => {
      mod.present().then(() => {});
      mod.onDidDismiss().then(async data => {
        const tmpAttender = [];

        data.data.forEach( att =>  {
          if (data.data.length <= this.description.maxAccompanyingParticipantsCountLimit) {
            tmpAttender.push(att);
          } else {
            this.toastService.presentInfo('too_much_attenders_added');
          }

        });
        // this.attenders = data.data;
        const arrayPromise = [];
        tmpAttender.map((element) => {
          const existingClient = this.bookingService.getBookingParticipants(this.booking['@id'], element.user.id, true).pipe(
              map((bookingParticipants: any) => {
                return {type: 'client', data: bookingParticipants['hydra:member']};
              })).toPromise();
          arrayPromise.push(existingClient);
          const existingUser = this.bookingService.getBookingParticipants(this.booking['@id'], element.user.id, false).pipe(
              map((bookingParticipants: any) => {
                return {type: 'user', data: bookingParticipants['hydra:member']};
              })).toPromise();
          arrayPromise.push(existingUser);
        });
        Promise.all(arrayPromise).then(dataPromise => {
          dataPromise.map(dP => {
            if (dP.data.length > 0) {
              const index = tmpAttender.findIndex( att => dP.data[0].user.id === att.user.id);
              tmpAttender.splice(index, 1);
              this.toastService.presentError('friend_already_in');
            }
          });
          if (this.description.registrationAvailableFor === 'all_subscribers') {
            tmpAttender.forEach(d => {
              if (d.user.subscriptionCardsAvailable !== null) {
                if (this.attenders.findIndex(el => el.user['@id'] === d.user['@id']) === -1) {
                  this.attenders.push(d);
                }
              } else {
                this.toastService.presentErrorWithName('no-access-course', d.user.firstName, d.user.lastName);
              }
            });
          } else if (this.description.registrationAvailableFor === 'everyone') {
            this.attenders = tmpAttender;
          } else {
            tmpAttender.forEach(d => {
              if (d.user.subscriptionCardsAvailable && d.user.subscriptionCardsAvailable.length > 0) {
                let count = 0;
                d.user.subscriptionCardsAvailable.forEach(subCard => {
                  this.description.allowedSubscriptionPlans.forEach(plan => {
                    if (subCard.subscriptionPlan['@id'] === plan['@id']) {
                      if (this.attenders.findIndex(el => el.user['@id'] === d.user['@id']) === -1) {
                        this.attenders.push(d);
                      }
                    } else {
                      count++;
                    }
                  });
                });
                if (count === this.description.allowedSubscriptionPlans.length * d.user.subscriptionCardsAvailable.length) {
                  this.toastService.presentErrorWithName('no-access-course', d.user.firstName, d.user.lastName);
                }
              } else {
                this.toastService.presentErrorWithName('no-access-course', d.user.firstName, d.user.lastName);
              }
            });
          }
          this.nextPaiement('false');
        });
      });
    });
  }

  async nextPaiement(finish?) {
    this.isReady1 = false;
    this.isReserved = true;
    let particpantAdded = {
      booking: this.booking['@id'],
      user: this.userMe['@id'],
      subscriptionCard: null,
      paymentMethod: "per_participant",
      accompanyingParticipants: []
    };

    if (this.realClient && this.realClient["hydra:member"]) {
      this.realClient = this.realClient["hydra:member"][0];
    }

    this.booking.price = 0;
    this.continueRest = 0;
    this.booking.restToPay = 0;
    this.restToPay = 0;

    if (this.realClient && this.realClient) {
      if (this.realClient.subscriptionCardsAvailable && this.description.variations.length > 0) {
        if (this.description.registrationAvailableFor === "all_subscribers"
            && this.realClient.subscriptionCardsAvailable.length > 0) {
          let minPrice = null;
          let subCard = null;
          let count = 0;
          this.realClient.subscriptionCardsAvailable.forEach(element2 => {
            this.description.variations.forEach(element => {
              if (element.subscriptionPlan['@id'] === element2.subscriptionPlan['@id']) {
                if (!minPrice) {
                  minPrice = element.pricePerParticipant;
                  subCard = element2['@id'];
                } else if (element.pricePerParticipant < minPrice) {
                  minPrice = element.pricePerParticipant;
                  subCard = element2['@id'];
                }
                this.myPrice = minPrice;
                particpantAdded = {
                  booking: this.booking['@id'],
                  user: this.userMe['@id'],
                  subscriptionCard: subCard,
                  paymentMethod: "per_participant",
                  accompanyingParticipants: []
                };
              } else {
                count++;
              }
            });
          });
          if (count === this.description.variations.length * this.realClient.subscriptionCardsAvailable.length) {
            this.myPrice = this.booking.pricePerParticipant;
          }
        }
        if (
            this.description.registrationAvailableFor === "subscribers" &&
            this.realClient.subscriptionCardsAvailable.length > 0
        ) {
          let minPrice = null;
          // let subCard = null;
          this.realClient.subscriptionCardsAvailable.forEach(element2 => {
            this.description.allowedSubscriptionPlans.forEach(async element3 => {
              if (element3['@id'] === element2.subscriptionPlan['@id']) {
                if (!minPrice) {
                  minPrice = element3.pricePerParticipant;
                  // subCard = element2['@id'];
                } else if (element3.pricePerParticipant < minPrice) {
                  minPrice = element3.pricePerParticipant;
                  // subCard = element2['@id'];
                }
                this.myPrice = minPrice;
              }
            });
          });
        }

        if (this.description.registrationAvailableFor === "everyone"
            && this.realClient.subscriptionCardsAvailable.length > 0) {
          let minPrice = null;
          let subCard = null;
          let count = 0;
          this.realClient.subscriptionCardsAvailable.forEach(element2 => {
            this.description.variations.forEach(element => {
              if (element.subscriptionPlan['@id'] === element2.subscriptionPlan['@id']) {
                if (!minPrice) {
                  minPrice = element.pricePerParticipant;
                  subCard = element2['@id'];
                } else if (element.pricePerParticipant < minPrice) {
                  minPrice = element.pricePerParticipant;
                  subCard = element2['@id'];
                }
                particpantAdded = {
                  booking: this.booking['@id'],
                  user: this.userMe['@id'],
                  subscriptionCard: subCard,
                  paymentMethod: "per_participant",
                  accompanyingParticipants: []
                };
                this.myPrice = minPrice;
              }
              else {
                count++;
              }
            });
          });
          if (count === this.realClient.subscriptionCardsAvailable.length * this.description.variations.length) {
            this.myPrice = this.booking.pricePerParticipant;
          }
        }
      }
      else {
        this.myPrice = this.booking.pricePerParticipant;
      }
    }
    if (this.description.registrationAvailableFor === "everyone" && !this.realClient?.subscriptionCardsAvailable) {
      this.myPrice = this.booking.pricePerParticipant;
    }

    if (this.description.registrationAvailableFor === "subscribers" && !this.realClient?.subscriptionCardsAvailable) {
      this.myPrice = this.booking.pricePerParticipant;
    }

    if (this.description.registrationAvailableFor === "all_subscribers" && !this.realClient?.subscriptionCardsAvailable) {
      this.myPrice = this.booking.pricePerParticipant;
    }
    if (this.description.registrationAvailableFor === "all_subscribers"
        && this.realClient && this.realClient.subscriptionCardsAvailable === null) {
      this.myPrice = this.booking.pricePerParticipant;
    }

    if (this.description.registrationAvailableFor === "subscribers" && this.realClient
        && this.realClient.subscriptionCardsAvailable === null) {
      this.myPrice = this.booking.pricePerParticipant;
    }

    if (this.attenders.length > 0) {
      // let count1 = 0;
      this.attenders.forEach((element, index) => {
        if (this.description.registrationAvailableFor === "all_subscribers") {
          const bool = true;
          let minPrice = null;
          let subCard = null;
          if (element.user.subscriptionCardsAvailable) {
            element.user.subscriptionCardsAvailable.forEach((element5) => {
              this.description.variations.forEach(element6 => {
                if (bool) {
                  if (element6.subscriptionPlan['@id'] === element5.subscriptionPlan['@id']) {
                    if (!minPrice) {
                      minPrice = element6.pricePerParticipant;
                      subCard = element5['@id'];
                    } else if (element6.pricePerParticipant < minPrice) {
                      minPrice = element6.pricePerParticipant;
                      subCard = element5['@id'];
                    }
                    // count1++;
                    if (element.user['@type'] === 'ClubClient') {
                      if (particpantAdded.accompanyingParticipants.findIndex(el => el.client === element.user['@id']) === -1) {
                        particpantAdded.accompanyingParticipants.push(
                            {
                              client: element.user['@id'],
                              subscriptionCard: subCard
                            },
                        );
                      } else {
                        particpantAdded.accompanyingParticipants.map( part => {
                          if (part.client === element.user['@id']) {
                            part.subscriptionCard = subCard;
                          }
                          return part;
                        });
                      }
                    } else {
                      if (particpantAdded.accompanyingParticipants.findIndex(el => el.user === element.user['@id']) === -1) {
                        particpantAdded.accompanyingParticipants.push(
                            {
                              user: element.user['@id'],
                              subscriptionCard: subCard
                            },
                        );
                      } else {
                        particpantAdded.accompanyingParticipants.map( part => {
                          if (part.user === element.user['@id']) {
                            part.subscriptionCard = subCard;
                          }
                          return part;
                        });
                      }
                    }
                    this.attenders[index]['user']['price'] = minPrice;
                  }
                  else {
                    if (element.user['@type'] === 'ClubClient') {
                      if (particpantAdded.accompanyingParticipants.findIndex(el => el.client === element.user['@id']) === -1) {
                        this.attenders[index]['user']['price'] = this.booking.pricePerParticipant;
                        particpantAdded.accompanyingParticipants.push(
                            {
                              client: element.user['@id'],
                              subscriptionCard: null
                            },
                        );
                      }
                    } else {
                      if (particpantAdded.accompanyingParticipants.findIndex(el => el.user === element.user['@id']) === -1) {
                        this.attenders[index]['user']['price'] = this.booking.pricePerParticipant;
                        particpantAdded.accompanyingParticipants.push(
                            {
                              user: element.user['@id'],
                              subscriptionCard: null
                            },
                        );
                      }
                    }
                  }
                }
              });
            });
          }
        }
        if (this.description.registrationAvailableFor === "subscribers") {
          const bool = true;
          let minPrice = null;
          let subCard = null;
          this.description.allowedSubscriptionPlans.forEach(async element4 => {
            element.user.subscriptionCardsAvailable.forEach((element5) => {
              if (bool) {
                if (element4['@id'] === element5.subscriptionPlan['@id']) {
                  if (!minPrice) {
                    minPrice = element4.pricePerParticipant;
                    subCard = element5['@id'];
                  } else if (element4.pricePerParticipant < minPrice) {
                    minPrice = element4.pricePerParticipant;
                    subCard = element5['@id'];
                  }
                  // count1++;
                  if (element.user['@type'] === 'ClubClient') {
                    if (particpantAdded.accompanyingParticipants.findIndex(el => el.client === element.user['@id']) === -1) {
                      particpantAdded.accompanyingParticipants.push(
                          {
                            client: element.user['@id'],
                            subscriptionCard: subCard
                          },
                      );
                    } else {
                      particpantAdded.accompanyingParticipants.map( part => {
                        if (part.client === element.user['@id']) {
                          part.subscriptionCard = subCard;
                        }
                        return part;
                      });
                    }
                  } else {
                    if (particpantAdded.accompanyingParticipants.findIndex(el => el.user === element.user['@id']) === -1) {
                      particpantAdded.accompanyingParticipants.push(
                          {
                            user: element.user['@id'],
                            subscriptionCard: subCard
                          },
                      );
                    } else {
                      particpantAdded.accompanyingParticipants.map( part => {
                        if (part.user === element.user['@id']) {
                          part.subscriptionCard = subCard;
                        }
                        return part;
                      });
                    }
                  }
                  this.attenders[index]['user']['price'] = element4.pricePerParticipant;

                  this.description.variations.forEach(element6 => {
                    if (element6.subscriptionPlan['@id'] === element5.subscriptionPlan['@id']) {
                      this.attenders[index]['user']['price'] = element6.pricePerParticipant;
                    }
                    else {
                      this.attenders[index]['user']['price'] = this.booking.pricePerParticipant;
                    }
                  });
                }
              }
            });
          });
        }
        if (this.description.registrationAvailableFor === "everyone") {
          const bool = true;
          let minPrice = null;
          let subCard = null;
          if (element.user.subscriptionCardsAvailable && element.user.subscriptionCardsAvailable.length > 0) {
            element.user.subscriptionCardsAvailable.forEach((element5) => {
              this.description.variations.forEach(element6 => {
                if (bool) {
                  if (element6.subscriptionPlan['@id'] === element5.subscriptionPlan['@id']) {
                    if (!minPrice) {
                      minPrice = element6.pricePerParticipant;
                      subCard = element5['@id'];
                    } else if (element6.pricePerParticipant < minPrice) {
                      minPrice = element6.pricePerParticipant;
                      subCard = element5['@id'];
                    }
                    // count1++;
                    if (element.user['@type'] === 'ClubClient') {
                      if (particpantAdded.accompanyingParticipants.findIndex(el => el.client === element.user['@id']) === -1) {
                        particpantAdded.accompanyingParticipants.push(
                            {
                              client: element.user['@id'],
                              subscriptionCard: subCard
                            },
                        );
                      } else {
                        particpantAdded.accompanyingParticipants.map( part => {
                          if (part.client === element.user['@id']) {
                            part.subscriptionCard = subCard;
                          }
                          return part;
                        });
                      }
                    } else {
                      if (particpantAdded.accompanyingParticipants.findIndex(el => el.user === element.user['@id']) === -1) {
                        particpantAdded.accompanyingParticipants.push(
                            {
                              user: element.user['@id'],
                              subscriptionCard: subCard
                            },
                        );
                      } else {
                        particpantAdded.accompanyingParticipants.map( part => {
                          if (part.user === element.user['@id']) {
                            part.subscriptionCard = subCard;
                          }
                          return part;
                        });
                      }
                    }
                    this.attenders[index]['user']['price'] = minPrice;
                  } else {
                    if (element.user['@type'] === 'ClubClient') {
                      if (particpantAdded.accompanyingParticipants.findIndex(el => el.client === element.user['@id']) === -1) {
                        this.attenders[index]['user']['price'] = this.booking.pricePerParticipant;
                      }
                    } else {
                      if (particpantAdded.accompanyingParticipants.findIndex(el => el.user === element.user['@id']) === -1) {
                        this.attenders[index]['user']['price'] = this.booking.pricePerParticipant;
                      }
                    }
                  }
                }
              });
            });
          }
          if (element.user['@type'] === 'ClubClient') {
            if (particpantAdded.accompanyingParticipants.findIndex(el => el.client === element.user['@id']) === -1) {
              particpantAdded.accompanyingParticipants.push(
                  {
                    client: element.user['@id']
                  },
              );
              this.attenders[index]['user']['price'] = this.booking.pricePerParticipant;
            }
          } else {
            if (particpantAdded.accompanyingParticipants.findIndex(el => el.user === element.user['@id']) === -1) {
              particpantAdded.accompanyingParticipants.push(
                  {
                    user: element.user['@id']
                  },
              );
              this.attenders[index]['user']['price'] = this.booking.pricePerParticipant;
            }
          }
        }
      });
    }

    this.booking.price = this.booking.price + this.myPrice;
    this.continueRest = this.continueRest + this.myPrice;
    this.booking.restToPay = this.booking.restToPay + this.myPrice;
    this.restToPay = this.restToPay + this.myPrice;
    if (this.attenders.length > 0) {
      this.attenders.forEach(element => {
        this.booking.price = this.booking.price + element.user.price;
        this.continueRest = this.continueRest + element.user.price;
        this.booking.restToPay = this.booking.restToPay + element.user.price;
        this.restToPay = this.restToPay + element.user.price;
      });
    }

    if (finish === 'no') {
      this.isReady = true;
      this.isReady1 = true;
      this.firstReady = true;
    }
    if (finish === 'true') {
      this.isReady1 = true;
      this.cancelBooking('true', particpantAdded);
    }

    if (finish === 'false') {
      this.isReady1 = true;
    }
  }

  openModalAddFriendOrUser() {
    this.showModalAddFriendOrUser = true;
  }

  closeModalAddFriendOrUser() {
    this.showModalAddFriendOrUser = false;
  }
}
