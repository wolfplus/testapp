import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../state/app.state';
import { ClubState } from './club.reducers';

export interface State extends AppState.State {
  clubState: ClubState;
}

const getClubState = createFeatureSelector<ClubState>('clubState');

export const getActiveSection = createSelector(
  getClubState,
  state => state.activeSection
);

export const getPreviousSection = createSelector(
  getClubState,
  state => state.previousSection
);

export const getNavToDirection = createSelector(
  getClubState,
  state => {
    return { navTo: state.navigationTo };
  }
);

export const getNavFromDirection = createSelector(
  getClubState,
  state => {
    return { navFrom: state.navigationFrom };
  }
);

export const getCurrentClub = createSelector(
    getClubState,
    state => state.currentClub
);

export const getClubPhoto = createSelector(
    getClubState,
    state => {
        if (state.currentClub.photos) {
            if (state.currentClub.photos.length > 0) {
                return state.currentClub.photos[0];
            }
        }
        return undefined;
    }
);

export const getClubLogo = createSelector(
    getClubState,
    state => {
        if (state.currentClub.logo) {
            return state.currentClub.logo;
        }
    }
);
export const getClubPh = createSelector(
    getClubState,
    state => {
        if (state.currentClub.photos) {
            if (state.currentClub.photos.length > 0) {
                return state.currentClub.photos[0];
            }
        }
        return undefined;
    }
);

export const getCurrentClubId = createSelector(
  getClubState,
  state => state.currentClubId
);

export const getCurrentClubLogoUrl = createSelector(
  getClubState,
  state => state.currentClub.logo?.contentUrl
);

export const getCurrentClubLoadingState = createSelector(
  getClubState,
  state => state.clubIsLoading
);

export const getCurrentClubLoadedState = createSelector(
  getClubState,
  state => state.clubIsLoaded
);

export const getCurrentClubLoadingError = createSelector(
  getClubState,
  state => state.clubLoadingError
);

export const getClubName = createSelector(
  getClubState,
  state => state.currentClub.name
);

export const getClubSummary = createSelector(
  getClubState,
  state => {
    return {
      name: state.currentClub.name,
      city: state.currentClub.city,
      zipCode: state.currentClub.zipCode
    };
  }
);

export const getClubDescription = createSelector(
  getClubState,
  state => {
    return state.currentClub.description;
  }
);

export const getClubLocation = createSelector(
  getClubState,
  state => {
    return {
      latitude: state.currentClub.latitude,
      longitude: state.currentClub.longitude
    };
  }
);

export const getClubAddress = createSelector(
  getClubState,
  state =>  {
    return {
      address: state.currentClub['address'],
      city: state.currentClub['city'],
      zipCode: state.currentClub['zipCode']
    };
  }
);

export const getCurrentClubPhotos = createSelector(
  getClubState,
  state => state.currentClub.photos
);

export const getCurrentClubActivityCategories = createSelector(
  getClubState,
  state => state.clubActivityCategories
);

export const getActivityCategoriesLoadingState = createSelector(
  getClubState,
  state => {
    return {
      categoriesAreLoading: state.clubActivityCategoriesAreLoading,
      categoriesAreLoaded: state.clubActivityCategoriesAreLoaded
    };
  }
);

export const getCurrentClubTimeTables = createSelector(
  getClubState,
  state => state.currentClub.timetables
);

export const getCurrentClubServices = createSelector(
  getClubState,
  state => state.clubServices
);

export const getServicesLoadingState = createSelector(
  getClubState,
  state => {
    return {
      servicesAreLoading: state.clubServicesAreLoading,
      servicesAreLoaded: state.clubServicesAreLoaded
    };
  }
);

export const getCurrentClubEvents = createSelector(
  getClubState,
  state => state.clubEvents
);

/* export const getSelectedEvent = createSelector(
  getClubState,
  state => state.clubEvents.find(event => event.id == props.eventId)
) */

export const getCurrentClubEventsState = createSelector(
  getClubState,
  state => state.clubEventsAreLoaded
);

export const getSelectedEvent = createSelector(
  getClubState,
  state => state.selectedClubEvent
);

export const getSelectedEventLoadingState = createSelector(
  getClubState,
  state => state.selectedClubEventIsLoaded
);

export const getCurrentClubCourses = createSelector(
  getClubState,
  state => state.clubCourses
);

export const getCurrentClubCoursesState = createSelector(
  getClubState,
  state => state.clubCoursesAreLoaded
);

export const getClubTimeZone = createSelector(
  getClubState,
  state => {
    return state.currentClub.timezone;
  }
);

export const getClubCurrency = createSelector(
  getClubState,
  state => {
    return state.currentClub.currency;
  }
);

export const getClubStripeAccountReference = createSelector(
  getClubState,
  state => {
      return state.currentClub.stripeAccountReference;
  }
);
