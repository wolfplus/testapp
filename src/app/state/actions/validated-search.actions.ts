import { Action } from '@ngrx/store';

export const ADD_VALIDATED_SEARCH     = '[SEARCH validated] Add Validated search term';
export const REMOVE_VALIDATED_SEARCH  = '[SEARCH validated] Remove Validated search term';

export class AddValidatedSearch implements Action {
    readonly  type = ADD_VALIDATED_SEARCH;
    constructor(public payload: string) {}
}

export class RemoveValidatedSearch implements Action {
    readonly  type = REMOVE_VALIDATED_SEARCH;
    constructor() { }
}

export type Actions = AddValidatedSearch | RemoveValidatedSearch;
