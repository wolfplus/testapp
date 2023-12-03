import {PaymentTokenPrice} from './payment-token-price';
import {SubscriptionPlan} from './subscription-plan';


export interface VariationPrice {
    '@id': string;
    '@type': string;
    paymentTokenPrices: Array<PaymentTokenPrice>;
    pricePerParticipant: number;
    subscriptionPlan: SubscriptionPlan;
}
