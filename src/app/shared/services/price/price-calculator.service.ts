import { Injectable } from '@angular/core';
import { Price } from '../../models/price';
import { ClientClub } from '../../models/client-club';
import { AttenderBooking } from '../../models/attender-booking';
import { HttpService } from '../http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PriceCalculatorService {

  constructor(
    private httpService: HttpService
  ) { }

  getClientPrice(
      price: Price,
      priceVariationsList: any,
      client: ClientClub | AttenderBooking = null,
      _club = null,
      startAt: any = null
  ) {
    if (startAt == null) {
      startAt = moment();
    }
    let subscriptionCardUsed = null;
    if (client === null || client === undefined) {
      return {
        price: (price.activityType == 'leisure') ? null : price.pricePerParticipant,
        subscriptionCard: null
      };
    } else if (client.subscriptionCardsAvailable && client.subscriptionCardsAvailable.length > 0) {
      const variationIn = [];
      let minPrice = null;
      priceVariationsList.map(variation => {
        const iriSubscriptionPlan = variation.subscriptionPlan['@id'];
        client.subscriptionCardsAvailable.forEach(subscriptionCard => {

          if (startAt.unix() < moment.utc(subscriptionCard.endDate).unix() && startAt.unix() > moment.utc(subscriptionCard.startDate).unix()) {
            let blockPriceId = variation.blockPrice.split('/')[6];
            if (subscriptionCard.subscriptionPlan['@id'] === iriSubscriptionPlan && price.id === blockPriceId) {
              variationIn.push(variation);
              if (minPrice === null) {
                minPrice = variation.pricePerParticipant;
                subscriptionCardUsed = subscriptionCard;
              } else if (minPrice > variation.pricePerParticipant) {
                minPrice = variation.pricePerParticipant;
                subscriptionCardUsed = subscriptionCard;
              }
            }
          }

        });
      });
      if (minPrice === null) {
        return {
          price: price.pricePerParticipant,
          subscriptionCard: ((subscriptionCardUsed !== null) ? subscriptionCardUsed['@id'] : null)
        };
      } else {
        return {
          price: minPrice,
          subscriptionCard: ((subscriptionCardUsed !== null) ? subscriptionCardUsed['@id'] : null)
        };
      }
    }
    return {
      price: price.pricePerParticipant,
      subscriptionCard: ((subscriptionCardUsed !== null) ? subscriptionCardUsed['@id'] : null)
    };
  }

  getPriceVariations(priceId: string): Observable<any> {
    return this.httpService.baseHttp<any>('get', `/clubs/playgrounds/timetables/blocks/prices/${priceId}/variations`, [], false).pipe(
        map(data => {
              return data['hydra:member'] ? data['hydra:member'] : [];
            }
        )
    );
  }

  getBlockPrice(priceId: string): Observable<any> {
    return this.httpService.baseHttp<any>('get', `/clubs/playgrounds/timetables/blocks/prices/${priceId}`, [], false);
  }

  getFormBlockPrice(iri: string): Observable<any> {
    return this.httpService.baseHttp<any>('get', iri);
  }

  getTimetablesBlocksPrice(iri: string): Observable<any> {
    return this.httpService.baseHttp<any>('get', iri, []);
  }
}
