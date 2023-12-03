export enum FilterKey {
    SURFACE = 'SURFACE',
    SORT = 'SORT',
    ACTIVITY = 'ACTIVITY',
    DISTANCE = 'DISTANCE',
    ENVIRONMENT = 'ENVIRONMENT'
}

export enum FilterCategory {
    CLUB = 'CLUB',
    MATCH = 'MATCH',
    PLAYGROUND = 'PLAYGROUND',
    ALL = 'ALL'
}

export interface Filter {
    keyFilter: FilterKey;
    value: string;
    label: string;
    category: FilterCategory;
}
export const ACTIVITY = 'playground.activity.id';
export const SURFACE = 'playground.surface.id';
export const LOCATION = 'location';

export enum FiltersConfig {
    BOOKING = 'booking',
    CLUB = 'club',
    MATCHES = 'matches'
}