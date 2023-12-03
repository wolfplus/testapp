import {Filter} from '../../shared/models/filter';
import * as FilterActions from '../actions/filter.actions';

export function reducer(state: Array<Filter> = [], action: FilterActions.Actions): Array<Filter> {
    const newState = new Array<Filter>();
    switch (action.type) {
        case FilterActions.ADD_FILTER:
            return [...state, action.payload];
        case FilterActions.REMOVE_FILTER_KEY:
            state.forEach(filter => {
                if (filter.keyFilter !== action.payload) {
                    newState.push(filter);
                }
            });
            return newState;
        case FilterActions.REMOVE_FILTER:
            state.map(( item, i) => {
                if (i !== action.payload) {
                    newState.push(item);
                }
            });
            return newState;
        case FilterActions.CLEAR_FILTER:
            return newState;
        default:
            return state;
    }
}
