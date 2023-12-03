import {AttenderBooking} from './attender-booking';
import {Activity} from './activity';
import {Club} from './club';
import {Payment} from './payment';
import { UserClient } from './user-client';
import { PlaygroundOptionDTO } from './playgroung-option';

export interface Booking {
    '@id'?: string;
    id?: string;
    name: string;
    canceled: boolean;
    payments?: Array<Payment>;
    startAt: string;
    endAt: string;
    club: any;
    price?: number;
    activity: Activity | string;
    activityType?: string;
    playgrounds: Array<any>;
    playgroundOptions?: Array<PlaygroundOptionDTO>;
    participants?: Array<AttenderBooking>;
    maxParticipantsCountLimit: number;
    minParticipantsCountLimit?: number;
    comments?: Array<string>;
    timetableBlockPrice: any;
    pricePerParticipant?: number;
    validatedAt?: string;
    userClient?: string | UserClient;
    paymentMethod?: string;
    creationOrigin: string;
    restToPay?: number;
    duration?: number;
    createdAt?: string;
    confirmed?: boolean;
    participantsCount?: number;
    customData?: any;
}

export interface BookingReceipt {
    '@id'?: string;
    id?: string;
    name: string;
    canceled: boolean;
    startAt: string;
    endAt: string;
    club: string|Club;
    price?: number;
    activity: any;
    activityType?: string;
    playgrounds: Array<string>;
    playgroundOptions?: Array<string>;
    participants?: Array<AttenderBooking>;
    maxParticipantsCountLimit: number;
    comments?: Array<string>;
    timetableBlockPrice: any;
    createdAt?: string;
    pricePerParticipant?: number;
    userClient?: any;
    confirmed?: boolean;
    participantsCount?: number;
    customData?: any;
}

export enum BookingCardConfig {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE"
}

export interface PaymentMethods
{
  booking: string;
  paymentMethods: Array<string>;
}