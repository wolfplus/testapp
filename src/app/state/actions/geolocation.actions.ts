import { Action } from '@ngrx/store';
import {Geolocation} from '../../shared/models/geolocation';

export const ADD_GEOLOCATION     = '[GEOLOCATION] Add';
export const REMOVE_GEOLOCATION  = '[GEOLOCATION] Remove';

export class AddGeolocation implements Action {
    readonly  type = ADD_GEOLOCATION;
    constructor(public payload: Geolocation) {}
}

export class RemoveGeolocation implements Action {
    readonly  type = REMOVE_GEOLOCATION;
    constructor(public payload: Geolocation) {}
}

export type Actions = AddGeolocation | RemoveGeolocation;
