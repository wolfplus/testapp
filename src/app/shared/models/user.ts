import {Avatar} from './avatar';

export interface User {
    body?: any;
    '@context'?: string;
    '@id'?: string;
    address?: string;
    avatar?: Avatar;
    tmpAvatar?: any;
    birthDate?: string;
    city?: string;
    country?: string;
    createdAt?: string;
    email?: string;
    enabled?: boolean;
    firstName?: string;
    id?: string;
    lastName?: string;
    locale?: string;
    phoneNumber?: string;
    roles?: Array<string>;
    username?: string;
    zipCode?: string;
    plainPassword?: string;
    password?: string;
    avatarTmp?: any;
    shortcutLastName?: string;
    preferredClubs?: Array<any>;
    relatedActivities?: Array<any>;
    friendshipStatus?: string;
    oneSignalPlayerIds?: Array<string>;
    wallet?: any;
    clubClientId?: string;
    clients?: Array<any>;
}

export interface UserSignupForm {
    phoneNumber?: string;
    avatar?: string;
    roles?: string;
    plainPassword?: string;
    confirmPlainPassword?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    enabled?: true;
    locale?: string;
    email?: string;
    address?: [
        string
    ];
    city?: string;
    zipCode?: string;
    country?: string;
    birthDate?: string;
}

export interface TokensDto {
    token?: string;
    refreshToken?: string;
    code?: number;
    message?: string;
}

export interface UserExistDto {
    exist: boolean;
    type: UserExistType;
}

export enum UserExistType {
    null = 'null',
    v2 = 'v2',
    v3 = 'v3'
}

export enum LoginTypesEnum {
    CLIENT = 'client',
    CLUB = 'club',
    ADMIN = 'admin',
    BASIC = 'basic'
}

export enum ProfileConfig {
    USER = 'user',
    PLAYER = 'player'
}