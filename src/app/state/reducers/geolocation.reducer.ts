import * as GeolocationActions from '../actions/geolocation.actions';
import {Geolocation} from '../../shared/models/geolocation';

export function geolocationReducer(state: Geolocation | undefined = undefined, action: GeolocationActions.Actions): Geolocation | undefined {
    switch (action.type) {
        case GeolocationActions.ADD_GEOLOCATION:
            return action.payload;
        case GeolocationActions.REMOVE_GEOLOCATION:
            return undefined;
        default:
            return state;
    }
}
