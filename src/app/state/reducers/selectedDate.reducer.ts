import * as SelectedDateActions from '../actions/selectedDate.actions';

export function selectedDateReducers(state: string = '', action: SelectedDateActions.Actions): string {
    switch (action.type) {
        case SelectedDateActions.ADD_SELECTED_DATE:
            return action.payload;
        case SelectedDateActions.REMOVE_SELECTED_DATE:
            return '';
        default:
            return state;
    }
}
