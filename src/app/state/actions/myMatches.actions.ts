import { createAction, props } from '@ngrx/store';

export const reloadMyMatches = createAction('[Matchs] Reload my Matches',
  props<{
    payload: boolean;
  }>());

