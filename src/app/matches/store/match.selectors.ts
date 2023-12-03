import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MatchState, selectAll } from './match.reducer';

const getMatchState = createFeatureSelector<MatchState>('matchState');

export const getAllMatches = createSelector(getMatchState, selectAll);

// TODO: delete
/* export const getSelectedMatch = createSelector(
  getMatchState,
  (state: MatchState) => state.selectedMatch
); */

export const getMatchesLoadingState = createSelector(
  getMatchState,
  (state: MatchState) => state.contentIsLoading
);

export const getMatchesLoadedState = createSelector(
  getMatchState,
  (state: MatchState) => state.contentIsLoaded
);

export const getMatchesLoadingError = createSelector(
  getMatchState,
  (state: MatchState) => state.error
);

export const getHydraView = createSelector(
  getMatchState,
  (state: MatchState) => state.hydraView
);
