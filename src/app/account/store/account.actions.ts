import {createAction, props} from '@ngrx/store';

export const setMe = createAction('[Account Component] setting /me route', props<{ data: any}>());
export const removeMe = createAction('[Account Component] removing /me route', props<{ data: any}>());
