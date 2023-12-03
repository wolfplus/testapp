import { ClubPhoto } from './club-photo';

export interface Club {
    '@id'?: string;
    id: string;
    name: string;
    activities?: Array<any> | null;
    appSportTimetableTypes?: Array<string> | null;
    description?: string;
    location?: Geoloc;
    latitude?: number;
    longitude?: number;
    locale?: string;
    timezone?: string;
    currency?: string;
    playgrounds?: Array<any>;
    services?: Array<Service>;
    photos?: Array<ClubPhoto>;
    logo?: any;
    updatedAt?: Date;
    address?: Array<string>;
    city?: string;
    zipCode?: string;
    country?: string;
    createdAt?: Date;
    mainPhoto?: MainPhoto;
    socialNetworks?: object;
    timetables?: Array<any>;
    deepLink?: string;
    isPreferred?: boolean;
    stripeAccountReference?: string;
    webSiteUrl?: string;
    universalLink?: string;
    internalRulesUrl?: string;
    generalTermsUrl?: string;
    environments?: any;
}
export interface Geoloc {
    latitude: number;
    longitude: number;
}
export interface Service {
    id: string;
    name: string;
    icon: any;
}
export interface MainPhoto {
    '@id': string;
    contentUrl: string;
}

export interface ClubLogo {
    id?: string;
    type?: string;
    contentUrl: string;
}

export interface ClubDto {
    id: string;
    name: string;
}

