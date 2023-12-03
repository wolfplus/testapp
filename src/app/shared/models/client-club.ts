import {Avatar} from './avatar';
import {Wallet} from './wallet';

export interface ClientClub {
    '@id': string;
    '@type': string;
    id: string;
    club: string;
    firstName: string;
    lastName: string;
    avatar: Avatar;
    credits: Array<any>;
    groups: Array<string>;
    subscriptionCards: Array<string>;
    formattedNumber: string;
    wallet: Wallet;
    shortcutLastName?: string;
    subscriptionCardsAvailable?: any;
    user: any;
}
