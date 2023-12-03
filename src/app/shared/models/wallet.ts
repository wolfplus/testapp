import {Club} from './club';

export interface Wallet {
    '@id': string;
    id: string;
    balance: number;
    overdraftAuthorized?: number;
    club: Club;
}
