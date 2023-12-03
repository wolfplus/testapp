import * as UserActions from '../actions/user.actions';
import {User} from '../../shared/models/user';

export function UserReducers(state: User | undefined = undefined, action: UserActions.Actions): User | undefined {
    switch (action.type) {
        case UserActions.ADD_USER:
            return action.payload;
        case UserActions.REMOVE_USER:
            return undefined;
        default:
            return state;
    }
}
