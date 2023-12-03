import { Action } from '@ngrx/store';

export const ADD_ITEMS     = '[SHOP] Add';
export const REMOVE_ITEMS  = '[SHOP] Remove';

export class AddItems implements Action {
    readonly  type = ADD_ITEMS;
    constructor(public payload: Array<any>) {}
}

export class RemoveItems implements Action {
    readonly  type = REMOVE_ITEMS;
    constructor() { }
}

export type Actions = AddItems | RemoveItems;
