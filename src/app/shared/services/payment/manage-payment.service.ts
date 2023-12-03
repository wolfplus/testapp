import { Injectable } from '@angular/core';
import {HttpService} from '../http.service';
import {Booking} from '../../models/booking';
import {Payment} from '../../models/payment';
import {Observable, from, of} from 'rxjs';
import {Cart} from '../../models/cart';
import {catchError, concatMap, tap, delay} from 'rxjs/operators';
import { StripeService } from './stripe.service';
import { UserClient } from '../../models/user-client';
import {EnvironmentService} from "../environment/environment.service";

@Injectable({
  providedIn: 'root'
})
export class ManagePaymentService {

  constructor(
    private httpService: HttpService,
    private stripeService: StripeService,
    private environmentService: EnvironmentService
  ) {
    if (this.environmentService.getEnvFile().paymentsProvider.includes('stripe')) {
      this.stripeService.reloadStripeAccount();
    }
  }

  createPaymentBooking(
    booking: Booking,
    cart: Cart,
    provider: string,
    method: string,
    currency: string,
    amount: number,
    clientId: string,
    userClient?: string | UserClient,
    captureMethod?: string
  ): Observable<any> {
    const payment: Payment  = {
      amount,
      cart: cart['@id'],
      client: clientId,
      currency,
      method,
      provider,
      userClient: userClient ? userClient : booking.userClient,
      captureMethod
    };
    return this.httpService.baseHttp('post', '/payments', payment, true);
  }

  checkOrangeMoney(orderId: string) {
    return this.httpService.baseHttp('get', '/orange-money/web-payments/' + orderId + '/status', [], true);
  }

  addPayment(payment) {
    try {
      if (payment.userClient && payment.userClient['@id']) {
        payment.userClient = payment.userClient['@id'];
      }
      return this.httpService.baseHttp('post', '/payments', payment, true);
    } catch (er) {
      return of(null);
    }
  }

  sendPayments(payments: Array<Payment>, clientId?): Observable<any> {
    console.log(payments, "<==== payments")
    if (payments) {
      payments = payments.filter( payment => payment && !payment['@id'])
        .map(payment => {
          if (payment.metadata && payment.metadata.paymentTokenId) {
            payment = {
              amount: payment.amount,
              cart: payment.cart,
              client: payment.client,
              currency: payment.currency,
              metadata: {
                paymentTokenId: payment.metadata.paymentTokenId
              },
              name: payment.name,
              provider: payment.provider,
            };
          }
          if (clientId) {
            payment.client = clientId;
          }

          return payment;
        });

      console.log(payments, "<==== payments after")

      if (payments.length === 0) {
        return of(undefined);
      }

      return from(payments)
        .pipe(
          concatMap( payment => {
            return this.addPayment(payment)
              .pipe(
                  tap(res => {
                    if (res == null) {
                      console.log('IT ERROR');
                    }
                  }),
                  catchError( err => {
                    return of(console.error("ERROR: ", err));
                  }),
                  delay(500)
              );
          })
        );
    }
    return of(undefined);
  }

  createCart(cart: any) {
    return this.httpService.baseHttp('post', '/payments/carts', cart, true);
  }

  updateCart(cartId: string, cart: Cart) {
    return this.httpService.baseHttp('put', cartId , cart, true);
  }

  manageWebPaymentResponse(payment) {
    this.stripeService.clientSecret = payment.metadata.clientSecret;
    return this.stripeService.confirmWebPayment();
  }

  managePaymentResponse(payment, clientId, card, stripeAccountReference) {
    this.stripeService.clientSecret = payment.metadata.clientSecret;
    return this.stripeService.confirmPayment(card, stripeAccountReference, clientId);
  }

}
