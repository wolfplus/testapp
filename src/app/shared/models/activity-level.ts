import { Club } from './club';

export interface ActivityLevel {
    '@id'?: string;
    activity?: string;
    club?: Club;
    description?: string;
    id: string;
    identifier?: number;
    label?: string;
    ranks?: Array<any>;
    selfAwardingLocked?: boolean;
    shortDescription?: string;
}
