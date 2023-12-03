import * as ShopActions from '../actions/shop.actions';

export function ShopReducers(state: Array<any> = [], action: ShopActions.Actions): Array<any> {
    switch (action.type) {
        case ShopActions.ADD_ITEMS:
            return action.payload;
        case ShopActions.REMOVE_ITEMS:
            return [];
        default:
            return state;
    }
}
