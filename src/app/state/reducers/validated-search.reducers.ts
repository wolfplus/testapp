import * as ValidatedSearchActions from '../actions/validated-search.actions';

export function validatedSearchReducer(state: string = '', action: ValidatedSearchActions.Actions): string {
    switch (action.type) {
        case ValidatedSearchActions.ADD_VALIDATED_SEARCH:
            return action.payload;
        case ValidatedSearchActions.REMOVE_VALIDATED_SEARCH:
            return '';
        default:
            return state;
    }
}
