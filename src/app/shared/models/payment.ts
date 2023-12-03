import {Cart} from './cart';
import {Metadata} from './metadata';
import { UserClient } from './user-client';

export interface Payment {
    id?: string;
    provider: string;
    method?: string;
    amount?: number;
    currency: string;
    status?: string;
    client?: string;
    club?: string;
    userClient?: string | UserClient;
    cart?: Cart | string;
    metadata?: Metadata;
    name?: string;
    captureMethod?:string
}
