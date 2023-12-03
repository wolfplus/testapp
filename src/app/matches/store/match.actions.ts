import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ClubMatch } from '../match.model';

export const createMatch = createAction(
  '[Match Create] Create Match',
  props<{ matchData: object }>()
);

export const createMatchSuccess = createAction(
  '[Match Create] Create Match Success',
  props<{ success: boolean }>()
);

export const createMatchFailure = createAction(
  '[Match Create] Create Match Failure',
  props<{ error: any }>()
);

export const loadMatchsRequestError = createAction(
  '[Match Effect] Load Matchs Request Error',
  props<{ error }>()
);

export const loadMatchs = createAction(
  '[Match List] Load Matchs',
  props<{ parameters: any }>()
);

export const loadMatch = createAction(
  '[Match List] Load Match',
  props<{ matchId: any }>()
);

export const loadMatchSuccess = createAction(
  '[Match/API] Load Match Success',
  props<{ match: ClubMatch }>()
);
export const loadMatchFailure = createAction(
  '[Match/API] Load Match Failure',
  props<{ error: any }>()
);
export const setHydraView = createAction(
  '[Match List] set hydraView',
  props<{ hydraView: object}>()
);

export const setAllMatchs = createAction(
  '[Match/API] Set Matchs',
  props<{ matchs: ClubMatch[] }>()
);

export const loadMatchsSuccess = createAction(
  '[Match/API] Load Matchs Success',
);

export const removeAllMatchs = createAction(
  '[Match/API] Remove Matchs'
);

export const resetHydraView = createAction(
  '[Match/API] Reset HydraView'
);

export const loadMatchsFailure = createAction(
  '[Match/API] Load Matchs Failure',
  props<{ error: any }>()
);

export const addMatch = createAction(
  '[Add Match] Add Match',
  props<{ clubId: string, match: ClubMatch }>()
);

export const addMatchSuccess = createAction(
  '[Match/API] Add Match Success',
  props<{ match: ClubMatch }>()
);

export const addMatchFailure = createAction(
  '[Match/API] Add Match Failure',
  props<{ error: any }>()
);

export const upsertMatch = createAction(
  '[Match/API] Upsert Match',
  props<{ match: ClubMatch }>()
);

export const updateMatch = createAction(
  '[Match/API] Update Match',
  props<{ match: Update<ClubMatch> }>()
);

export const updateMatchSuccess = createAction(
  '[Match/API] Update Match Success',
  props<{ match: Update<ClubMatch> }>()
);

export const updateMatchFailure = createAction(
  '[Match/API] Update Match Failure',
  props<{ error: any }>()
);

export const deleteMatch = createAction(
  '[Match/MatchDetails] Delete Match',
  props<{ id: string }>()
);

export const deleteMatchSuccess = createAction(
  '[Match/API] Delete Match Success',
  props<{ id: any }>()
);

export const matchDeletedSuccess = createAction(
  '[Match/API] Match Deleted Success'
);

export const deleteMatchFailure = createAction(
  '[Match/API] Delete Match Failure',
  props<{ error: any }>()
);
