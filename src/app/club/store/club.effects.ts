import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {catchError, exhaustMap, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import { of } from 'rxjs';
import { ClubService } from '../club.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ClubState } from './club.reducers';
import { ClubActions } from './actions';
import { Club } from 'src/app/shared/models/club';

@Injectable()
export class ClubEffects {

  constructor(
    private actions$: Actions,
    private clubService: ClubService,
    private errorService: ErrorService,
    private store: Store<ClubState>,
    private toast: ToastService
  ) {}

  loadClub$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(ClubActions.loadClub),
        withLatestFrom(this.store),
        exhaustMap(([action, _store]) => {
          return this.clubService.getClub(action.clubId)
            .pipe(
              switchMap((club: Club) => {
                return of(ClubActions.loadClubSuccess({club}));
              }),
              catchError((error: any) => {
                const errMessage = this.errorService.getMessage(error);
                this.toast.presentError(errMessage);
                return of(ClubActions.loadClubFailure({ error: errMessage }));
              })
            );
        })
      )
  });

  loadClubActivityCategories$ = createEffect( () => {
    return this.actions$
        .pipe(
            ofType(ClubActions.loadClubActivityCategories),
            withLatestFrom(this.store),
            exhaustMap(([action, _store]) => {
                return this.clubService.getClubActivities(action.clubId)
                    .pipe(
                        switchMap( activities => {
                            return of(ClubActions.loadClubActivityCategoriesSuccess({activities}));
                        })
                    );
            })
        )
  });

  loadClubServices$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(ClubActions.loadClubServices),
        withLatestFrom(this.store),
        mergeMap(([action, _store]) => {
          return this.clubService.getClubServices(action.clubId)
            .pipe(
              switchMap( services => {
                return of(ClubActions.loadClubServicesSuccess({services}));
              }),
              catchError((error: any) => {
                const errMessage = this.errorService.getMessage(error);
                this.toast.presentError(errMessage);
                return of(ClubActions.loadClubServicesFailure({ error: errMessage }));
              })
            );
        })
      )
  });

  loadClubEvents$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(ClubActions.loadClubUpcomingEvents),
        withLatestFrom(this.store),
        exhaustMap(([action, _store]) => {
          return this.clubService.getClubEvents(action.clubId)
            .pipe(
              switchMap( events => {
                return of(ClubActions.loadClubUpcomingEventsSuccess({events}));
              }),
              catchError((error: any) => {
                const errMessage = this.errorService.getMessage(error);
                this.toast.presentError(errMessage);
                return of(ClubActions.loadClubUpcomingEventsFailure({ error: errMessage }));
              })
            );
        })
      )
  });

  loadClubEvent$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(ClubActions.loadSelectedClubEvent),
        withLatestFrom(this.store),
        exhaustMap(([action, _store]) => {
          return this.clubService.getClubEvent(action.eventId)
            .pipe(
              switchMap( event => {
                return of(ClubActions.loadSelectedClubEventSuccess({event}));
              }),
              catchError((error: any) => {
                const errMessage = this.errorService.getMessage(error);
                this.toast.presentError(errMessage);
                return of(ClubActions.loadSelectedClubEventFailure({ error: errMessage }));
              })
            );
        })
      )
  });

  loadClubCourses$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(ClubActions.loadClubUpcomingCourses),
        withLatestFrom(this.store),
        mergeMap(([action, _store]) => {
          return this.clubService.getClubCourses(action.clubId)
            .pipe(
              switchMap( courses => {
                return of(ClubActions.loadClubUpcomingCoursesSuccess({courses}));
              }),
              catchError((error: any) => {
                const errMessage = this.errorService.getMessage(error);
                this.toast.presentError(errMessage);
                return of(ClubActions.loadClubUpcomingCoursesFailure({ error: errMessage }));
              })
            );
        })
      )
  });
  // TODO: remove code and use match Effects not Club Effects
  loadClubMatches = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(ClubActions.loadClubMatches),
        withLatestFrom(this.store),
        mergeMap(([action, _store]) => {
          return this.clubService.getClubMatches(action.clubId)
            .pipe(
              map( matches => {
                return ClubActions.loadClubMatchesSuccess({matches});
              }),
              catchError((error: any) => {
                const errMessage = this.errorService.getMessage(error);
                this.toast.presentError(errMessage);
                return of(ClubActions.loadClubMatchesFailure({ error: errMessage }));
              })
            );
        })
      )
  });
}
