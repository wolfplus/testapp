import {createFeatureSelector, createSelector} from "@ngrx/store";

const getAccountState = createFeatureSelector<any>('accountState');

export const getCurrentMe = createSelector(
    getAccountState,
    state => { console.log(state, "le state stp <==="); return state.me; }
);
