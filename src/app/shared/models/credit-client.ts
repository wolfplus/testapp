export interface CreditClient {
    '@id': string;
    balance: number;
    expiresAt: string;
    type: string;
    name: string;
    description: string;
    client: any;
    paymentToken: any;
    id: string;
    updatedAt: string;
    createdAt: string;
    isUsable?: boolean;
    isExpired?: boolean;
    isInsufficient?: boolean;
}
