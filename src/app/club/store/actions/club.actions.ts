import { createAction, props } from '@ngrx/store';
import { Activity } from '../../models/activity';
import { ClubCourse } from '../../models/club-course';
import { ClubEvent } from '../../models/club-event';
import { Service } from '../../models/service';
import { Club } from 'src/app/shared/models/club';

export const navToClubSection = createAction(
  '[NavLinks] navToClubSection',
  props<{ sectionName: string, sectionIndex: number}>()
);

export const updateNavSection = createAction(
  '[NavLinks] updateNavSection',
  props<{ sectionName: string, sectionIndex: number }>()
);

export const updateNavDirections = createAction(
  '[NavLinks] updateNavDirections',
  props<{ navTo: string }>()
);

export const loadClub = createAction(
  '[Club] LoadClub',
  props<{ clubId: string }>()
);

export const loadClubSuccess = createAction(
  '[Club Effects] LoadClub Success',
  props<{ club: Club }>()
);

export const loadClubFailure = createAction(
  '[Club Effects] LoadClub Failure',
  props<{ error: any }>()
);

export const loadClubActivityCategories = createAction(
  '[Club] LoadClubActivityCategories',
  props<{ clubId: string }>()
);

export const loadClubActivityCategoriesSuccess = createAction(
  '[Club Effects] LoadClubActivityCategories Success',
  props<{ activities: Activity[] }>()
);

export const loadClubActivityCategoriesFailure = createAction(
  '[Club Effects] LoadClubActivityCategories Failure',
  props<{ error: any }>()
);

export const loadClubServices = createAction(
  '[Club] LoadClubServices',
  props<{ clubId: string }>()
);

export const loadClubServicesSuccess = createAction(
  '[Club Effects] LoadClubServices Success',
  props<{ services: Service[] }>()
);

export const loadClubServicesFailure = createAction(
  '[Club Effects ] LoadClubServices Failure',
  props<{ error: any }>()
);

export const loadClubUpcomingEvents = createAction(
  '[Club] LoadClubUpcomingEvents',
  props<{ clubId: string }>()
);

export const loadClubUpcomingEventsSuccess = createAction(
  '[Club Effects] LoadClubUpcomingEvents Success',
  props<{ events: ClubEvent[] }>()
);

export const loadClubUpcomingEventsFailure = createAction(
  '[Club Effects] LoadClubUpcomingEvents Failure',
  props<{ error: any }>()
);

export const loadSelectedClubEvent = createAction(
  '[Club] LoadSelectedClubEvent',
  props<{ eventId: string }>()
);

export const loadSelectedClubEventSuccess = createAction(
  '[Club Effects] LoadSelectedClubEvent Success',
  props<{ event: ClubEvent }>()
);

export const loadSelectedClubEventFailure = createAction(
  '[Club Effects] LoadSelectedClubEvent Failure',
  props<{ error: any }>()
);

export const loadClubUpcomingCourses = createAction(
  '[Club] LoadClubUpcomingCourses',
  props<{ clubId: string }>()
);

export const loadClubUpcomingCoursesSuccess = createAction(
  '[Club Effects] LoadClubUpcomingCourses Success',
  props<{ courses: ClubCourse[] }>()
);

export const loadClubUpcomingCoursesFailure = createAction(
  '[Club Effects] LoadClubUpcomingCourses Failure',
  props<{ error: any }>()
);

// TODO: remove code and use matchActions not ClubActions
export const loadClubMatches = createAction(
  '[Club] LoadClubMatches',
  props<{ clubId: string }>()
);
// TODO: remove code and use matchActions not ClubActions
export const loadClubMatchesSuccess = createAction(
  '[Club Effects] LoadClubMatches Success',
  // TODO: replace type any with model
  props<{ matches: any[] }>()
);
// TODO: remove code and use matchActions not ClubActions
export const loadClubMatchesFailure = createAction(
  '[Club Effects] LoadClubMatches Failure',
  props<{ error: any }>()
);

