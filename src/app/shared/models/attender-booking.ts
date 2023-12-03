import {CreditConsume} from './credit-consume';
import {AbonnemnetConsume} from './abonnemnet-consume';
import {BookingFormAttender} from './booking-form-attender';
import {PathAvatar} from './pathAvatar';
import {Payment} from './payment';
import {ClientClub} from './client-club';
import {Avatar} from './avatar';

export interface AttenderBooking {
    '@id'?: string;
    id?: string;
    bookingOwner?: boolean;
    user?: any;
    client?: ClientClub;
    booking?: string;
    category?: any;
    payout?: string;
    dateAdded?: string;
    canceled?: boolean;
    dateCanceled?: string;
    firstName?: string;
    lastName?: string;
    userId?: string;
    pathAvatar?: PathAvatar;
    avatar?: Avatar;
    bookingFormAttender?: BookingFormAttender;
    creditUse?: CreditConsume;
    restToPay?: number;
    price?: number;
    status?: string;
    customData?: string;
    subscriptionCard?: AbonnemnetConsume;
    subscriptionCardsAvailable?: any;
    payment?: Payment;
}
