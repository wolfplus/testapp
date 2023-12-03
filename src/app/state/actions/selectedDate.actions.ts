import { Action } from '@ngrx/store';

export const ADD_SELECTED_DATE     = '[SELECTED_DATE] Add';
export const REMOVE_SELECTED_DATE  = '[SELECTED_DATE] Remove';

export class AddSelectedDate implements Action {
    readonly  type = ADD_SELECTED_DATE;
    constructor(public payload: any) {}
}

export class RemoveSelectedDate implements Action {
    readonly  type = REMOVE_SELECTED_DATE;
    constructor() {}
}

export type Actions = AddSelectedDate | RemoveSelectedDate;
