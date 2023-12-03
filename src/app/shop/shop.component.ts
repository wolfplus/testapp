import { Payment } from 'src/app/shared/models/payment';
import { ShopItem } from 'src/app/shared/models/shop-item';
import { CartItem } from './../shared/models/cart-item';
import * as ShopActions from '../state/actions/shop.actions';
import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ShopService } from '../shared/services/shop.service';
import { tap, map, filter, last, takeUntil, switchMap } from 'rxjs/operators';
import { combineLatest, iif, Observable, of, Subject } from 'rxjs';
import {InfiniteScrollCustomEvent, ModalController, NavController, Platform} from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { ClubState } from '../club/store/club.reducers';
import { CartState, IItem } from './state/cart.state';
import { ManagePaymentService } from '../shared/services/payment/manage-payment.service';
import { LoaderService } from '../shared/services/loader/loader.service';
import { ToastService } from '../shared/services/toast.service';
import { User } from '../shared/models/user';
import {
  getClubCurrency,
  getCurrentClubPhotos,
  getClubStripeAccountReference,
  getCurrentClub
} from '../club/store';
import { EnvironmentService } from '../shared/services/environment/environment.service';
import {AccountService} from "../shared/services/account/account.service";
import {AppState} from "../state/app.state";
import {ShopGiftFormComponent} from "./components/shop-gift-form/shop-gift-form.component";


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent implements OnInit, OnDestroy {
  @Input() clubId: string;
  @Input() clubName: string;
  enable = false;

  shopCategories: Array<any> = [];
  shopItems: Array<ShopItem> = [];
  getShopItemsError = false;
  loadProduct = false;

  item: ShopItem;
  totalSameItems: number;
  totalPriceSameItems: number;
  toGift = false;
  giftTo: any;

  showConfirm = false;
  showCategories = true;
  showCategoryDetail = false;
  currentIndexCategory: number;
  showItemDetail = false;

  showDisabledFooter = true;

  listClubs: Array<any> = [];

  clubCurrency$: Observable<string>;
  clubPhotoUrl$: Observable<string>;
  stripeAccountReference$: Observable<string>;

  totalItems: number;
  alreadyPaid: number = 0;

  payments: Array<Payment> = [];

  cartId: string | undefined = undefined;
  user: User | undefined;

  defaultCard: any;
  descriptionCat = '';
  selectedClub: string;
  itemsPerPage: number = 30;

  clubIdStorage: any;
  isLoaded = false;
  client: any;
  hasLoaded = false;

  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private shopService: ShopService,
    private modalCtrl: ModalController,
    private clubStore: Store<ClubState>,
    public cartState: CartState,
    private ref: ChangeDetectorRef,
    private managePaymentService: ManagePaymentService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private platform: Platform,
    private environmentService: EnvironmentService,
    private accountService: AccountService,
    private modalController: ModalController,
    private navCtrl: NavController
  ) {
    this.platform.backButton.subscribeWithPriority(101, () => {
      this.handleBackButton();
    });
  }

  ngOnInit() {
    this.clubStore.select(getCurrentClub).pipe(
      takeUntil(this.ngUnsubscribe),
      tap(club => {
      this.clubIdStorage = club.id;
      this.clubId = club.id;
      this.listClubs.push(club);
      this.isLoaded = true;
      this.loadData();
    })).subscribe();

  }

  loadMoreData($event) {
    this.itemsPerPage = this.itemsPerPage + 30;
    this.shopService.getShopItemsByCategory(this.clubId, this.shopCategories[this.currentIndexCategory].id, this.itemsPerPage).pipe(
        takeUntil(this.ngUnsubscribe),
        tap(data => {
          ($event as InfiniteScrollCustomEvent).target.complete();
          this.store.dispatch(new ShopActions.RemoveItems());
          if (data['hydra:member']) {
            if (data['hydra:member'].length > 0) {
              this.store.dispatch(new ShopActions.AddItems(data['hydra:member']));
            }
            this.showCategoryDetail = true;
          }
        })).subscribe();
  }

  loadData() {
    this.clubCurrency$ = this.clubStore.pipe(
      takeUntil(this.ngUnsubscribe),
      select(getClubCurrency)
    );

    this.clubPhotoUrl$ = this.clubStore.pipe(
      takeUntil(this.ngUnsubscribe),
      select(getCurrentClubPhotos),
      switchMap(photos =>  {
        const photo = photos[0];
        return iif(
          () => photo !== undefined,
          of(this.environmentService.getEnvFile().pathFiles + photo.contentUrl),
          of("")
        )
      }),
    );

    this.stripeAccountReference$ = this.clubStore.pipe(
      takeUntil(this.ngUnsubscribe),
      select(getClubStripeAccountReference),
    );

    this.store.select("user").pipe(
      takeUntil(this.ngUnsubscribe),
      tap(user => {

      this.user = user;
      if (user) {
        this.accountService.getMyClients(user.id).pipe(
          takeUntil(this.ngUnsubscribe),
          tap(data => {
          if (data['hydra:member']) {
            data['hydra:member'].forEach(item => {
              if (item.club === '/clubs/' + this.clubId) {
                this.client = item;
              }
            });
          }
        })).subscribe();
      }
    })).subscribe();
    return this.shopService.getShopItems(this.clubIdStorage, 30)
      .pipe(
        map(items => {

          if (items !== undefined) {
            this.getShopItemsError = false;
            return items['hydra:member'];
          } else {
            this.getShopItemsError = true;
            return [];
          }
        }),
        tap(shopItems => {
          this.processShopItems(shopItems);
        })
      )
      .subscribe(
          () => {
            this.hasLoaded = true;
          }
      );
    this.alreadyPaid = 0;
  }

  segmentChanged() {
    this.clubId = this.clubIdStorage;

    this.shopCategories = [];
    this.shopItems = [];
    this.platform.backButton.subscribeWithPriority(101, () => {
      this.handleBackButton();
    });
    this.loadData();
    this.backOnCategories();
  }

  processShopItems(items: Array<ShopItem>) {
    this.shopItems = items;

    this.shopService.getShopCategories(this.clubIdStorage).pipe(tap(data => {
      if (data) {
        this.shopCategories = data['hydra:member'];

        this.totalItems = this.cartState.getStates(this.clubIdStorage).totalItems;
        this.ref.markForCheck();
      }
    })).subscribe();



    // if (items !== undefined && items.length) {
    //   items.forEach(item => {
    //     item.categories.forEach(itemCat => {
    //       if (this.shopCategories.find(cat => cat.id === itemCat.id) === undefined) {
    //         this.shopCategories.push(itemCat);
    //       }
    //     });
    //   });
    // }

  }

  processSameItemCount() {
    const currentItem = this.cartState.getStates(this.clubIdStorage).items.find(e => e.item.id === this.item.id);
    if (currentItem) {
      this.totalSameItems = currentItem.count;
      this.totalPriceSameItems = (currentItem.item.unitaryPrice * this.totalSameItems);
    } else {
      this.totalSameItems = 0;
      this.totalPriceSameItems = 0;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  backOnCategories() {
    this.store.dispatch(new ShopActions.RemoveItems());
    this.showCategoryDetail = false;
    this.showCategories = true;
    this.showItemDetail = false;
  }

  backOnCategoryDetail() {
    this.showCategoryDetail = true;
    this.showCategories = false;
    this.showItemDetail = false;
  }

  handleBackButton() {
    if (this.showConfirm) {
      this.showConfirm = false;
    } else {
      if (this.showCategories && !this.showCategoryDetail && !this.showItemDetail) {
        this.close();
      } else
        if (!this.showCategories && this.showCategoryDetail && !this.showItemDetail) {
          this.backOnCategories();
        } else
          if (!this.showCategories && !this.showCategoryDetail && this.showItemDetail) {
            this.backOnCategoryDetail();
          }
      this.showDisabledFooter = true;
    }
    this.ref.markForCheck();
  }

  handleCartButton() {
    this.showConfirm = true;
  }

  updatePayment(payments) {
    this.payments = payments.map((payment: Payment) => {
      return { ...payment, cart: this.cartId };
    });
  }

  creditCardSelected(card) {
    this.defaultCard = card;
  }

  clickOnCategorie(index) {
    this.showConfirm = false;
    this.showCategories = false;
    this.showItemDetail = false;
    this.descriptionCat = this.shopCategories[index].description;
    this.showCategoryDetail = true;
    this.loadProduct = false;
    this.currentIndexCategory = index;
    this.itemsPerPage = 30;
    this.shopService.getShopItemsByCategory(this.clubId, this.shopCategories[index].id, this.itemsPerPage).pipe(
      takeUntil(this.ngUnsubscribe),
      tap(data => {

      this.store.dispatch(new ShopActions.RemoveItems());
      if (data['hydra:member']) {
        if (data['hydra:member'].length > 0) {
          this.store.dispatch(new ShopActions.AddItems(data['hydra:member']));
        }
        this.showCategoryDetail = true;
      }
    })).subscribe();
  }

  clickOnItem(item) {
    this.item = item;
    this.showCategories = false;
    this.showCategoryDetail = false;
    this.showItemDetail = true;
    this.processSameItemCount();
  }

  clickOnAddItemToCard(toGift: any) {
    this.toGift = toGift;
    this.totalPriceSameItems += this.item.unitaryPrice;
    this.showDisabledFooter = false;
    this.ref.markForCheck();
  }

  clickOnRemoveItemFromCard() {
    this.totalPriceSameItems -= this.item.unitaryPrice;
    this.showDisabledFooter = (this.cartState.getStates(this.clubIdStorage).items.
      filter(item => item.item.id === this.item.id).length === 0) || false;
    this.ref.markForCheck();

  }

  updateCard() {
    if (!this.toGift) {
      this.showDisabledFooter = true;
      this.totalSameItems = this.totalPriceSameItems / this.item.unitaryPrice;
      this.cartState.updateItem(this.clubIdStorage, this.item, this.totalSameItems);
      this.processSameItemCount();
      this.totalItems = this.cartState.getStates(this.clubIdStorage).totalItems;
    } else {
      if (this.totalPriceSameItems / this.item.unitaryPrice > 0) {
        this.modalController.create({
          component: ShopGiftFormComponent,
          animated: true
        }).then(modal => {
          modal.present().then();
          modal.onDidDismiss().then((data: any) => {
            if (data.data.customData && data.data.success) {
              this.showDisabledFooter = true;
              this.totalSameItems = this.totalPriceSameItems / this.item.unitaryPrice;
              this.cartState.updateItem(this.clubIdStorage, {...this.item, customData: data?.data.customData}, this.totalSameItems)
              this.processSameItemCount();
              this.totalItems = this.cartState.getStates(this.clubIdStorage).totalItems;
            }
            this.ref.markForCheck();
          });
        });
      } else {
        this.showDisabledFooter = true;
        this.totalSameItems = this.totalPriceSameItems / this.item.unitaryPrice;
        this.cartState.updateItem(this.clubIdStorage, this.item, this.totalSameItems);
        this.processSameItemCount();
        this.totalItems = this.cartState.getStates(this.clubIdStorage).totalItems;
      }

    }

    this.ref.markForCheck();
  }

  pay() {
    this.loaderService.presentLoading();

    if (this.cartId === undefined) {
      const cart: CartItem[] = [];
      this.cartState.getStates(this.clubIdStorage).items.forEach((item: IItem) => {
        if (!item.item.customData) {
          cart.push({ quantity: item.count, price: item.item.unitaryPrice, product: item.item['@id'] });
        } else {
          cart.push({ quantity: item.count, customData: item.item.customData ,price: item.item.unitaryPrice, product: item.item['@id'] });
        }
      });
      this.managePaymentService.createCart({ items: cart, club: `/clubs/${this.clubId}`}).subscribe(data => {
        if (data.client) {
          this.client['@id'] = data.client;
        }
        this.cartId = data['@id'];
        this.payments.forEach((_elemnt, index) => {
          this.payments[index]['cart'] = this.cartId;
        });
        this.paymentLast();
      });
    } else {
      this.payments.forEach((_elemnt, index) => {
        this.payments[index]['cart'] = this.cartId;
      });
      this.paymentLast();
    }

  }

  paymentLast() {
    this.clubCurrency$.pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap((currency) => {
        return iif(
          () => this.payments.length > 0,
          this.managePaymentService.sendPayments(this.payments)
          .pipe(
            tap(resp => {
              if (resp) {
                //paymentsSent += 1;
                this.alreadyPaid += resp['amount'];
              }
            }),
            last(),
            tap(response => {
              if (response && response.status === "succeeded") {
  
                if (this.alreadyPaid === this.cartState.getStates(this.clubIdStorage).totalPrice) {
                  this.paymentSuccess();
                  this.cartState.resetCart();
                } else {
                  this.paymentCB(currency);
                }
              }
            })
          ),
          new Observable((subscriber) => {
            this.paymentCB(currency);
            subscriber.next();
            subscriber.complete();
          })
        )
      })
    ).subscribe();
    
    // if (this.payments.length > 0) {
    //   //let paymentsSent = 0;
    //   this.managePaymentService.sendPayments(this.payments)
    //     .pipe(
    //       tap(resp => {
    //         if (resp) {
    //           //paymentsSent += 1;
    //           this.alreadyPaid += resp['amount'];
    //         }
    //       }),
    //       last(),
    //       tap(response => {
    //         if (response && response.status === "succeeded") {

    //           if (this.alreadyPaid === this.cartState.getStates(this.clubIdStorage).totalPrice) {
    //             this.paymentSuccess();
    //             this.cartState.resetCart();
    //           } else {
    //             this.paymentCB();
    //           }
    //         }
    //       })
    //     )
    //     .subscribe();
    // } else {
    //   this.clubCurrency$.pipe(
    //     takeUntil(this.ngUnsubscribe)
    //   ).subscribe((currency) => this.paymentCB(currency));
    // }
  }

  paymentCB(currency: string) {

    if (this.alreadyPaid === undefined || this.alreadyPaid === null) {
      this.alreadyPaid = 0;
    }

    const dataCart = this.cartState.getStates(this.clubIdStorage);

    if (!dataCart) {
      // TODO : add error toast
      return;
    }
    if (dataCart.totalPrice === null || dataCart.totalPrice === undefined) {
      dataCart.totalPrice = 0;
    }

    if ((dataCart.totalPrice - this.alreadyPaid) <= 0) {
      // TODO : add error toast
      return;
    }

    if (this.cartId === undefined) {
      return;
    }

    if (this.user === undefined || this.user['@id'] === undefined) {
      return;
    }

    const payment: Payment = {
      amount: dataCart.totalPrice - this.alreadyPaid,
      client: this.client['@id'],
      cart: this.cartId,
      currency,
      method: 'card',
      provider: 'stripe',
      userClient: this.user['@id']
    };

      combineLatest([
        this.managePaymentService.addPayment(
          payment
        ),
        this.stripeAccountReference$
      ])
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(([result, _stripeAccountReference]) => result !== undefined),
        tap(([result, stripeAccountReference]) => {
          if (this.platform.is("desktop") || this.platform.is('mobileweb')) {
            this.managePaymentService.manageWebPaymentResponse(
              result).then(() => {
                this.paymentSuccess();
                this.cartState.resetCart();
              }
            ).catch(() => {
              this.loaderService.dismiss();
              });
          } else {
            this.managePaymentService.managePaymentResponse(
              result, this.client['@id'], this.defaultCard, stripeAccountReference).then(() => {
                this.paymentSuccess();
                this.cartState.resetCart();
              }
            ).catch(() => {
              this.loaderService.dismiss();
            });
          }

        })
      )
      .subscribe();
  }

  paymentSuccess(){
    this.cartState.resetCart();
    this.cartId = undefined;
    this.totalItems = 0
    this.toastService.presentSuccess('shop_pay_success', 'top');
    this.navCtrl.navigateRoot('/home').then(() =>
        this.loaderService.dismiss()
    );
    this.ref.markForCheck();
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  triggerPaymentData(event) {
    this.enable = event;
  }

}
