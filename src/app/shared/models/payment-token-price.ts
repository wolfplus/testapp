import {PaymentToken} from './payment-token';

export interface PaymentTokenPrice {
    '@id': string;
    '@type': string;
    paymentToken: Array<PaymentToken>;
    pricePerParticipant: number;
}
