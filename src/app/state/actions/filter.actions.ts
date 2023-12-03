import { Action } from '@ngrx/store';
import { Filter } from '../../shared/models/filter';

export const ADD_FILTER     = '[FILTER] Add';
export const REMOVE_FILTER  = '[FILTER] Remove';
export const REMOVE_FILTER_KEY = '[FILTER] Remove by key';
export const CLEAR_FILTER = '[FILTER] Clear';

export class Addfilter implements Action {
    readonly  type = ADD_FILTER;
    constructor(public payload: Filter) { }
}

export class RemoveFilter implements Action {
    readonly  type = REMOVE_FILTER;
    constructor(public payload: number) { }
}

export class RemoveFilterByKeyFilter implements Action {
    readonly  type = REMOVE_FILTER_KEY;
    constructor(public payload: string) { }
}

export class ClearFilters implements Action {
    readonly  type = CLEAR_FILTER;
    constructor() { }
}

export type Actions = Addfilter | RemoveFilter | RemoveFilterByKeyFilter | ClearFilters;
