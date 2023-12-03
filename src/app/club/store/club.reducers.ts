import {
  createReducer,
  on
} from '@ngrx/store';
import { Activity } from '../models/activity';
import { ClubCourse } from '../models/club-course';
import { ClubEvent } from '../models/club-event';
import { Service } from '../models/service';
import { ClubActions } from './actions';
import { Club } from 'src/app/shared/models/club';

export const clubStateFeatureKey = 'clubState';

export interface ClubState {
  navigatedSections: Array<{name: string, index: number}>;
  previousSection: {name: string, index: number};
  activeSection: {name: string, index: number};
  navigationFrom: string;
  navigationTo: string;
  currentClub: Club;
  currentClubId: string;
  clubIsLoading: boolean;
  clubIsLoaded: boolean;
  clubLoadingError: string;
  clubActivityCategories: Array<Activity>;
  clubActivityCategoriesAreLoading: boolean;
  clubActivityCategoriesAreLoaded: boolean;
  clubActivityCategoriesLoadingError: string;
  clubServices: Array<Service>;
  clubServicesAreLoading: boolean;
  clubServicesAreLoaded: boolean;
  clubServicesLoadingError: string;
  clubEvents: Array<ClubEvent>;
  clubEventsAreLoading: boolean;
  clubEventsAreLoaded: boolean;
  clubEventsLoadingError: string;
  selectedClubEvent: ClubEvent;
  selectedClubEventIsLoading: boolean;
  selectedClubEventIsLoaded: boolean;
  clubCourses: Array<ClubCourse>;
  clubCoursesAreLoading: boolean;
  clubCoursesAreLoaded: boolean;
  clubCoursesLoadingError: string;
  clubMatches: Array<any>;
  clubMatchesAreLoading: boolean;
  clubMatchesLoaded: boolean;
  clubMatchesError: string;
}

const initialState: ClubState = {
  currentClub: {
    id: null,
    name: null,
    description: null,
    latitude: null,
    longitude: null,
    locale: null,
    timezone: "Europe/Paris",
    currency: null,
    playgrounds: null,
    timetables: null,
    photos: null,
    logo: null,
    updatedAt: null,
    address: null,
    city: null,
    zipCode: null,
    country: null,
    createdAt: null
  },
  navigatedSections: [],
  previousSection: null,
  activeSection: null,
  navigationFrom: null,
  navigationTo: null,
  currentClubId: null,
  clubIsLoading: false,
  clubIsLoaded: false,
  clubLoadingError: null,
  clubActivityCategories: null,
  clubActivityCategoriesAreLoading: false,
  clubActivityCategoriesAreLoaded: false,
  clubActivityCategoriesLoadingError: null,
  clubServices: null,
  clubServicesAreLoading: false,
  clubServicesAreLoaded: false,
  clubServicesLoadingError: null,
  clubEvents: null,
  clubEventsAreLoading: false,
  clubEventsAreLoaded: false,
  clubEventsLoadingError: null,
  selectedClubEvent: null,
  selectedClubEventIsLoading: false,
  selectedClubEventIsLoaded: false,
  clubCourses: null,
  clubCoursesAreLoading: false,
  clubCoursesAreLoaded: false,
  clubCoursesLoadingError: null,
  clubMatches: [],
  clubMatchesAreLoading: false,
  clubMatchesLoaded: false,
  clubMatchesError: null
};


export const clubReducer = createReducer<ClubState>(
  initialState,
  on(ClubActions.loadClub, (state, _action): ClubState => {
    return {
      ...state,
      clubIsLoading: true,
      clubIsLoaded: false
    };
  }),
  on(ClubActions.loadClubSuccess, (state, action): ClubState => {
    return {
      ...state,
      currentClub: action.club,
      currentClubId: action.club.id,
      clubIsLoading: false,
      clubIsLoaded: true
    };
  }),
  on(ClubActions.loadClubFailure, (state, action): ClubState => {
    return {
      ...state,
      currentClub: {
        id: null,
        name: null,
        description: null,
        latitude: null,
        longitude: null,
        locale: null,
        timezone: null,
        currency: null,
        playgrounds: null,
        timetables: null,
        services: null,
        photos: null,
        logo: null,
        updatedAt: null,
        address: null,
        city: null,
        zipCode: null,
        country: null,
        createdAt: null
      },
      currentClubId: null,
      clubIsLoading: false,
      clubIsLoaded: false,
      clubLoadingError: action.error
    };
  }),
  on(ClubActions.navToClubSection, (state, action): ClubState => {
    return {
      ...state,
      activeSection: {name: action.sectionName, index: action.sectionIndex}
    };
  }),
  on(ClubActions.updateNavSection, (state, _action): ClubState => {
    return {
      ...state,
      previousSection: state.navigatedSections[0],
      navigatedSections: [...state.navigatedSections, state.activeSection].slice(state.navigatedSections.length - 2),
      /* activeSection: {name: action.sectionName, index: action.sectionIndex}, */
    };
  }),

  on(ClubActions.updateNavDirections, (state, action): ClubState => {
    return {
      ...state,
      navigationTo: action.navTo
    };
  }),
  on(ClubActions.loadClubActivityCategories, (state, _action): ClubState => {
    return {
      ...state,
      clubActivityCategoriesAreLoading: true,
      clubActivityCategoriesAreLoaded: false
    };
  }),
  on(ClubActions.loadClubActivityCategoriesSuccess, (state, action): ClubState => {
    return {
      ...state,
      clubActivityCategories: action.activities,
      clubActivityCategoriesAreLoading: false,
      clubActivityCategoriesAreLoaded: true
    };
  }),
  on(ClubActions.loadClubActivityCategoriesFailure, (state, action): ClubState => {
    return {
      ...state,
      clubActivityCategories: [],
      clubActivityCategoriesAreLoading: false,
      clubActivityCategoriesAreLoaded: false,
      clubActivityCategoriesLoadingError: action.error
    };
  }),
  on(ClubActions.loadClubServices, (state, _action): ClubState => {
    return {
      ...state,
      clubServicesAreLoading: true,
      clubServicesAreLoaded: false
    };
  }),
  on(ClubActions.loadClubServicesSuccess, (state, action): ClubState => {
    return {
      ...state,
      clubServices: action.services,
      clubServicesAreLoading: false,
      clubServicesAreLoaded: true
    };
  }),
  on(ClubActions.loadClubServicesFailure, (state, action): ClubState => {
    return {
      ...state,
      clubActivityCategories: [],
      clubServicesAreLoading: false,
      clubServicesAreLoaded: false,
      clubServicesLoadingError: action.error
    };
  }),
  on(ClubActions.loadClubUpcomingEvents, (state, _action): ClubState => {
    return {
      ...state,
      clubEventsAreLoading: true,
      clubEventsAreLoaded: false,
    };
  }),
  on(ClubActions.loadClubUpcomingEventsSuccess, (state, action): ClubState => {
    return {
      ...state,
      clubEvents: action.events,
      clubEventsAreLoading: false,
      clubEventsAreLoaded: true,
    };
  }),
  on(ClubActions.loadClubUpcomingEventsFailure, (state, action): ClubState => {
    return {
      ...state,
      clubEvents: null,
      clubEventsAreLoading: false,
      clubEventsAreLoaded: false,
      clubEventsLoadingError: action.error
    };
  }),
  on(ClubActions.loadSelectedClubEvent, (state, _action): ClubState => {
    return {
      ...state,
      selectedClubEventIsLoading: true,
      selectedClubEventIsLoaded: false
    };
  }),
  on(ClubActions.loadSelectedClubEventSuccess, (state, action): ClubState => {
    return {
      ...state,
      selectedClubEvent: action.event,
      selectedClubEventIsLoading: false,
      selectedClubEventIsLoaded: true
    };
  }),
  on(ClubActions.loadSelectedClubEventFailure, (state, _action): ClubState => {
    return {
      ...state,
      selectedClubEvent: null,
      selectedClubEventIsLoading: false,
      selectedClubEventIsLoaded: false
    };
  }),
  on(ClubActions.loadClubUpcomingCourses, (state, _action): ClubState => {
    return {
      ...state,
      clubCoursesAreLoading: true,
      clubCoursesAreLoaded: false,
    };
  }),
  on(ClubActions.loadClubUpcomingCoursesSuccess, (state, action): ClubState => {
    return {
      ...state,
      clubCourses: action.courses,
      clubCoursesAreLoading: false,
      clubCoursesAreLoaded: true,
    };
  }),
  on(ClubActions.loadClubUpcomingCoursesFailure, (state, action): ClubState => {
    return {
      ...state,
      clubCoursesAreLoading: false,
      clubCoursesAreLoaded: false,
      clubCoursesLoadingError: action.error
    };
  }),
);
