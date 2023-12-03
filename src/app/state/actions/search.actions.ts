import { Action } from '@ngrx/store';

export const ADD_SEARCH     = '[SEARCH] Add';
export const REMOVE_SEARCH  = '[SEARCH] Remove';

export class AddSearch implements Action {
    readonly  type = ADD_SEARCH;
    constructor(public payload: string) {}
}

export class RemoveRemove implements Action {
    readonly  type = REMOVE_SEARCH;
    constructor(public payload: number) { }
}

export type Actions = AddSearch | RemoveRemove;
