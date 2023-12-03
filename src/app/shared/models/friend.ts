import {Avatar} from './avatar';
import {User} from './user';
import {ClientClub} from "./client-club";

export interface Friend {
    '@id'?: string;
    id: string;
    bookingOwner?: boolean;
    firstName: string;
    canceled?: boolean;
    lastName: string;
    avatar: Avatar;
    birthDate: string;
    phoneNumber: string;
    user?: User;
    client?: ClientClub;
    hasBeenAdded?: boolean;
    levelToDisplay?: any;
    restToPay?: number;
    shortcutLastName?: string;
}
