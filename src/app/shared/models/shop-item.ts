export interface ShopItem {
    name: string;
    description?: string;
    type: string;
    stock?: number;
    unitaryPrice: number;
    paymentTokenPack?: PaymentTokenPack;
    giftable?: boolean;
    customData?: any;
    variations: Array<any>;
    attributes: Array<any>;
    club: string;
    categories: Array<any>;
    photos: Array<any>;
    id: string;
    shortDescription?: string;
}

export interface PaymentTokenPack {
    items: Array<PaymentToken>;
}

export interface PaymentToken {
    quantity: number;
    paymentToken: {
        name: string,
        type: string,
        validityDurationCount: number,
        validityPeriodicityType: number
    };
}
