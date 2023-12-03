import { Injectable } from '@angular/core';
import { PaymentCard } from '../../models/payment-card';
import { Stripe as StripeNGX } from '@ionic-native/stripe/ngx';
import { HttpService } from '../http.service';
import { ToastService } from '../toast.service';
import { getClubStripeAccountReference } from 'src/app/club/store';
import { ClubState } from 'src/app/club/store/club.reducers';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { Subscription, BehaviorSubject } from 'rxjs';
import { EnvironmentService } from '../environment/environment.service';

declare var Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  clubCurrencySub: Subscription;
  pkStripe: string;
  accountStripe: string;
  clientSecret: string;
  stripeV3: any;
  card: any;
  cardSubject$ = new BehaviorSubject<any>(undefined);
  card$ = this.cardSubject$.asObservable();

  constructor(
    private stripeNgx: StripeNGX,
    private httpService: HttpService,
    private toastService: ToastService,
    private clubStore: Store<ClubState>,
    private environmentService: EnvironmentService
  ) {
    if (this.environmentService.getEnvFile().paymentsProvider.includes('stripe')) {
      console.log('HELLO THERE');
      this.pkStripe = this.environmentService.getEnvFile().stripePK;
      this.reloadStripeAccount();
    }
  }

  reloadStripeAccount() {
    this.clubCurrencySub = this.clubStore.pipe(
        select(getClubStripeAccountReference),
        tap((res: any) => {
          this.accountStripe = res;
          this.stripeV3 = Stripe(this.pkStripe, {
            stripeAccount: this.accountStripe
          });
        })
    ).subscribe();
  }

  setCard(card) {
    this.card = card;
    this.cardSubject$.next(this.card);
  }

  getCard() {
    return this.card;
  }

  getStripe() {
    return this.stripeV3;
  }

  createCard(card: PaymentCard) {
    this.stripeNgx.setPublishableKey(this.pkStripe).then();
    return this.stripeNgx.createCardToken(card);
  }

  getPaymentIntent(amount: number, currency: string) {
    const data = {
      amount,
      currency
    };
    return this.httpService.baseHttp('post', '/stripe/payment-intents', data, true);
  }

  getPaymentMethod(type: string, token: string, clientId: string = null) {
    const data = {
      type,
      card: { token },
      metadata: {
        client_id: (clientId ? clientId.replace('/clubs/clients/', '') : null),
      }
    };

    return this.httpService.baseHttp('post', '/stripe/payment-methods', data, true);
  }

  confirmWebPayment(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stripeV3.createToken(this.card).then(() => {

          this.stripeV3.confirmCardPayment(this.clientSecret, {
            payment_method: {card: this.card}
          }).then(resp => {
            if (resp.error) {
              // Handle error here
              this.toastService.presentError('' + resp.error.message);
              reject(resp.error);
            } else if (resp.paymentIntent && resp.paymentIntent.status === 'succeeded') {
              // Handle successful payment here
              resolve(resp);
            }
            reject(resp);
          }).catch(error => {
            this.toastService.presentError('Error : ' + error.message);
            reject(error);
          });
      });
    });

  }

  // TODO : Get stripeAccount from Club !!
  confirmPayment(defaultCard, clubStripeAccount: string, clientId: string = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.createCard(defaultCard).then(ret => {
        this.getPaymentMethod('card', ret.id, clientId).subscribe(paymentM => {
          const stripePK = this.environmentService.getEnvFile().stripePK;
          const stripe = Stripe(stripePK, {
            stripeAccount: clubStripeAccount,
          });
          stripe.confirmCardPayment(this.clientSecret, {
            payment_method: paymentM.id
          }).then(resp => {
            if (resp.error) {
              // Handle error here
              this.toastService.presentError('' + resp.error.message);
              reject(resp.error);
            } else if (resp.paymentIntent && resp.paymentIntent.status === 'succeeded') {
              // Handle successful payment here
              resolve(resp);
            }
            reject(resp);
          }).catch(error => {
            this.toastService.presentError('Error : ' + error.message);
            reject(error);
          });
        });
      }).catch(err => {
        this.toastService.presentError( err);
        reject(err);
      });
    });

  }

  validateCardNumber(cardNumber: string) {
    return this.stripeNgx.validateCardNumber(cardNumber).then(res => {
      return res;
    });
  }

  addPaymentSourceToStripe(card: any, ownerName: string) {
    const ownerInfo = {
      owner: {
        name: ownerName
      },
    };
    return this.stripeV3.createSource(card, ownerInfo);
  }

  addPaymentSource(iriUser, iriClub, srcSource) {
    const postData = {
      club: iriClub,
      user: iriUser,
      stripeSourceReference: srcSource
    }
    return this.httpService.baseHttp('post', '/stripe/customers/sources', postData, true);
  }

  deleteCardFromUser(stripeSourceReference, clubId, userId) {
    return this.httpService.baseHttp('delete', `/stripe/customers/sources/${stripeSourceReference}?club.id=${clubId}&user.id=${userId}`, false);
  }

  getPaymentSource(userId: string, clubId: string) {
    return this.httpService.baseHttp('get', `/stripe/customers/sources?user.id=${userId}&club.id=${clubId}&type=card`, true);
  }

  setDefaultPaymentSource(userId: string, clubId: string, cardId: string) {
    const data = {
      source: cardId
    };
    return this.httpService.baseHttp('put', `/user-clients/${userId}/clubs/${clubId}/default-payment-source`, data);
  }
}
