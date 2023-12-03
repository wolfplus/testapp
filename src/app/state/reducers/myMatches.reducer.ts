import { createReducer, on } from '@ngrx/store';
import * as MyMatchesActions from '../actions/myMatches.actions';

export interface MyMatchesState {
    reloadMyMatches: boolean;
}

const initialState: MyMatchesState = {
    reloadMyMatches: false
};

export const myMatchesReducer = createReducer(
    initialState,
    on( MyMatchesActions.reloadMyMatches, (state, action): MyMatchesState => {
        return {
          ...state,
          reloadMyMatches: action.payload
        };
    })
);
