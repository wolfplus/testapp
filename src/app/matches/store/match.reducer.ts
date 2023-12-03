import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ClubMatch } from '../match.model';
import * as MatchActions from './match.actions';
// import { Action } from 'rxjs/internal/scheduler/Action';

export const matchesFeatureKey = 'matchState';

export interface MatchState extends EntityState<ClubMatch> {
  // additional entities state properties
  error: any;
  contentIsLoading: boolean;
  contentIsLoaded: boolean;
  selectedMatch: ClubMatch;
  hydraView: object;
  matchCreatedSuccess: boolean;
  matchCreateError: any;
  loadMatchError: any;
}

export const adapter: EntityAdapter<ClubMatch> = createEntityAdapter<ClubMatch>();

export const initialState: MatchState = adapter.getInitialState({
  // additional entity state properties
  error: null,
  contentIsLoading: false,
  contentIsLoaded: false,
  selectedMatch: null,
  hydraView: null,
  matchCreatedSuccess: false,
  matchCreateError: null,
  loadMatchError: null
});

export const matchReducer = createReducer(
  initialState,
  on(MatchActions.createMatchSuccess,
    (state, _action) => {
      return {
        ...state,
        matchCreatedSuccess: true,
        matchCreateError: null
      };
    }
  ),
  on(MatchActions.createMatchFailure,
    (state, action) => {
      return {
        ...state,
        matchCreatedSuccess: false,
        matchCreateError: action.error
      };
    }
  ),
  on(MatchActions.loadMatchs,
    (state, _action) => {
      return {
        ...state,
        contentIsLoading: true,
        contentIsLoaded: false,
        error: null
      };
    }
  ),
  on(MatchActions.setHydraView,
    (state, action) => {
      return {
        ...state,
        hydraView: action.hydraView
      };
  }),
  on(MatchActions.setAllMatchs,
  (state, action) => {
    return adapter.upsertMany(action.matchs, state);
  }),
  on(MatchActions.loadMatchsSuccess,
    (state, _action) => {
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: true,
      };
    }
  ),
  on(MatchActions.removeAllMatchs,
    (state, _action) => {
      return adapter.removeAll(state);
    }
  ),
  on(MatchActions.resetHydraView,
    (state, _action) => {
      return {
        ...state,
        hydraView: null
      };
  }),
  on(MatchActions.loadMatchsRequestError,
    (state, action) => {
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: false,
        hydraView: null,
        error: action.error
      };
    }
  ),
  on(MatchActions.loadMatchsFailure,
    (state, action) => {
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: false,
        hydraView: null,
        error: action.error
      };
    }
  ),
  on(MatchActions.addMatch,
    (state, _action) => {
      return {
        ...state,
        contentIsLoading: true,
        contentIsLoaded: false,
      };
    }
  ),
  on(MatchActions.addMatchSuccess,
    (state, action) => {
      adapter.addOne(action.match, state);
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: true,
        error: null,
        matchCreatedSuccess: true,
        matchCreateError: false
      };
    }
    ),
  on(MatchActions.addMatchFailure,
    (state, action) => {
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: false,
        error: action.error,
        matchCreatedSuccess: false,
        matchCreateError: true
      };
    }
  ),
  on(MatchActions.updateMatch,
    (state, _action) => {
      return {
        ...state,
        contentIsLoading: true,
        contentIsLoaded: false,
      };
    }
  ),
  on(MatchActions.updateMatchSuccess,
    (state, action) => {
      adapter.updateOne(action.match, state);
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: true,
        error: null
      };
    }
  ),
  on(MatchActions.updateMatchFailure,
    (state, action) => {
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: false,
        error: action.error
      };
    }
  ),
  on(MatchActions.deleteMatch,
    (state, _action) => {
      return {
        ...state,
        contentIsLoading: true,
        contentIsLoaded: false,
      };
    }
  ),
  on(MatchActions.deleteMatchSuccess,
    (state, action) => {
      return adapter.removeOne(action.id, state);
    }
  ),
  on(MatchActions.matchDeletedSuccess,
    (state, _action) => {
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: true,
        error: null
      };
    }
  ),
  on(MatchActions.deleteMatchFailure,
    (state, action) => {
      return {
        ...state,
        contentIsLoading: false,
        contentIsLoaded: false,
        error: action.error
      };
    }
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
