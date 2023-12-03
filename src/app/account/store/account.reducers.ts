import { createReducer, on } from '@ngrx/store';
import {removeMe, setMe} from './account.actions';

export const initialState = {
    me: null
};

const _accountReducer = createReducer(initialState,
    on(setMe, (state, action) => {
        console.log("est ce qu'il se passe quelque chose ? ???", state)
        return {
            ...state,
            me: action.data,
        };
    }),
    on(removeMe, (state) => {
        return {
            ...state,
            me: null,
        };
    })
);

export function accountReducer(state, action) {
    return _accountReducer(state, action);
}
