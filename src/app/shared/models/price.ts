import {VariationPrice} from './variation-price';

export interface Price {
    '@id': string;
    '@type': string;
    id?: string;
    activity: string;
    activityType?: string;
    defaultPrice: boolean;
    duration: number;
    maxParticipantsCountLimit: number;
    paymentTokenPrices: Array<any>;
    pricePerParticipant: number;
    variations: Array<VariationPrice>;
}
