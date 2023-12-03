export interface PaymentCard {
    id?: string;
    name: string;
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
    type?: string;
    default?: boolean;
}
