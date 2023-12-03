export interface SlotBlock {
    startAt: string;
    endAt: string;
    prices: Array<any>;
    bookable: boolean;
    isOpen: boolean;
    selectTime?: any;
    instalmentPercentage?: any;
    paymentMethods?: Array<string>;
}
