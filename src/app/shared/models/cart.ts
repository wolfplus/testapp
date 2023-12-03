import {CartItem} from './cart-item';

export interface Cart {
    club?: string;
    items: Array<CartItem>;
}
