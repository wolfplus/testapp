import * as SearchActions from '../actions/search.actions';

export function searchReducers(state: string = '', action: SearchActions.Actions): string {
    switch (action.type) {
        case SearchActions.ADD_SEARCH:
            return action.payload;
        case SearchActions.REMOVE_SEARCH:
            return '';
        default:
            return state;
    }
}
